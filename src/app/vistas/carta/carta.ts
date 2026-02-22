import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
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

        const filtros: { categoria?: string; disponible?: boolean } =
            this.categoriaActiva !== 'todas'
                ? { categoria: this.categoriaActiva, disponible: true }
                : { disponible: true };

        this.sub = this.apiService.getProductos(filtros).subscribe({
            next: (p) => { this.productos = p; this.cargando = false; },
            error: () => { this.error = 'No se pudo cargar la carta.'; this.cargando = false; }
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
    }
}
