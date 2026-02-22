import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService, LineaCarrito } from '../../services/carrito.service';
import { SessionService } from '../../services/session.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  // 1: Envío, 2: Pago, 3: Resumen
  currentStep: number = 1;
  selectedShipping: number | null = null;
  selectedPayment: number | null = null;

  comprando = false;
  errorCompra: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public carrito: CarritoService,
    private session: SessionService,
    private api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  /** Líneas reales del carrito (sustituye al array mock) */
  get items(): LineaCarrito[] {
    return this.carrito.lineas;
  }

  selectShipping(option: number): void {
    this.selectedShipping = option;
  }

  selectPayment(option: number): void {
    this.selectedPayment = option;
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    } else if (step === 2 && this.selectedShipping !== null) {
      this.currentStep = 2;
    } else if (step === 3 && this.selectedShipping !== null && this.selectedPayment !== null) {
      this.currentStep = 3;
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.selectedShipping !== null) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.selectedPayment !== null) {
      this.currentStep = 3;
    }
  }

  getSubtotal(): number {
    return this.carrito.lineas.reduce((acc, l) => acc + l.producto.precio * l.cantidad, 0);
  }

  getShippingCost(): number {
    if (this.selectedShipping === 2) return 4.00;
    return 0; // Recogida en tienda: gratis
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  comprar(): void {
    const usuario = this.session.getSession();
    if (!usuario) {
      this.errorCompra = 'Debes iniciar sesión para realizar una compra.';
      return;
    }

    if (this.carrito.lineas.length === 0) {
      this.errorCompra = 'El carrito está vacío.';
      return;
    }

    const total = this.getTotal();

    const payload = {
      cliente: usuario._id,
      lineas: this.carrito.lineas.map(l => ({
        producto: l.producto._id,
        cantidad: l.cantidad,
        precioUnitario: l.producto.precio,
        subtotal: l.producto.precio * l.cantidad,
      })),
      total,
    };

    this.comprando = true;
    this.errorCompra = null;

    this.api.createCompra(payload).subscribe({
      next: (compraCreada) => {
        // Limpiar carrito
        this.carrito.limpiar();

        // Actualizar la sesión con los datos frescos del servidor (puntos, totalGastado)
        this.api.getCliente(usuario._id).subscribe(clienteActualizado => {
          this.session.setSession(clienteActualizado);
        });

        this.comprando = false;
        // Redirigir al perfil para que el usuario vea su compra
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        this.comprando = false;
        this.errorCompra = err?.error?.mensaje ?? 'Error al procesar la compra. Inténtalo de nuevo.';
      },
    });
  }

}
