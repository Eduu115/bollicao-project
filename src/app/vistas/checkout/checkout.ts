import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { //para que empiece desde arriba del todo
      window.scrollTo(0, 0);
    }
  }

  // Mock data for summary
  items = [
    { id: 1, nombre: 'Tarta de Fresa Premium', precio: 34.99, imagen: '/img/placeholder.png', cantidad: 1 }
  ];

  selectShipping(option: number): void {
    this.selectedShipping = option;
  }

  selectPayment(option: number): void {
    this.selectedPayment = option;
  }

  goToStep(step: number): void {
    // Solo permitir volver a pasos anteriores o avanzar si ya está completo
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
    return this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  getShippingCost(): number {
    if (this.selectedShipping === 3) return 3.95;
    if (this.selectedShipping === 4) return 5.95;
    if (this.selectedShipping === 5) return 2.95;
    return 0; // Opciones 1 y 2 son gratis
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  comprar(): void {
    console.log("¡Compra finalizada!");
    // Aquí irá la lógica final
  }

}
