import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription, timeout } from 'rxjs';
import { ApiService, IProducto } from '../../services/api.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
    selector: 'app-carta',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './carta.html',
    styleUrl: './carta.css'
})
export class Carta implements OnInit, OnDestroy {
    productos: IProducto[] = [];
    cargando = true;
    categoriaActiva = 'todas';
    error = '';
    addedIds = new Set<string>();
    showToast = false;
    toastMessage = '';
    private timeoutId: ReturnType<typeof setTimeout> | null = null;

    readonly categorias = [
        { id: 'todas', label: 'Todo' },
        { id: 'tarta', label: 'Tartas' },
        { id: 'bollo', label: 'Bollos' },
        { id: 'pastel', label: 'Pasteles' },
        { id: 'galleta', label: 'Galletas' },
        { id: 'bebida', label: 'Bebidas' },
        { id: 'otro', label: 'Otros' },
    ];

    private sub?: Subscription;

    constructor(
        private apiService: ApiService,
        private carritoService: CarritoService,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.cargarProductos();
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    cargarProductos(): void {
        this.sub?.unsubscribe();
        this.cargando = true;
        this.error = '';

        const filtros: any =
            this.categoriaActiva !== 'todas'
                ? { categoria: this.categoriaActiva, disponible: true, noCache: true }
                : { disponible: true, noCache: true };

        // Añadimos un timeout y forzamos change detection para evitar bloqueos
        this.sub = this.apiService.getProductos(filtros)
            .pipe(timeout(10000))
            .subscribe({
                next: (p) => {
                    this.productos = p;
                    this.cargando = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error al cargar productos:', err);
                    this.error = 'No se pudo cargar la carta. Revisa tu conexión o inténtalo de nuevo.';
                    this.cargando = false;
                    this.cdr.detectChanges();
                }
            });
    }

    filtrarPor(cat: string): void {
        if (cat === this.categoriaActiva) return;
        this.categoriaActiva = cat;
        this.cargarProductos();
    }

    addToCart(producto: IProducto): void {
        if (!isPlatformBrowser(this.platformId)) return;
        this.carritoService.anyadir(producto, 1);
        this.addedIds.add(producto._id);
        setTimeout(() => this.addedIds.delete(producto._id), 1500);
        this.mostrarToast(`${producto.nombre} añadido al carrito`);
    }

    mostrarToast(mensaje: string): void {
        this.showToast = true;
        this.toastMessage = mensaje;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            this.showToast = false;
            this.timeoutId = null;
        }, 2000);
    }
}
