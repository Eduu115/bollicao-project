import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, IProducto } from '../../../services/api.service';

@Component({
    selector: 'app-popular-products',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './popular-products.html',
    styleUrl: './popular-products.css'
})
export class PopularProductsComponent implements OnInit {
    cargando = true;
    error: string | null = null;
    productos: IProducto[] = [];

    constructor(
        private api: ApiService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.api.getProductos({ disponible: true }).subscribe({
            next: (lista) => {
                this.productos = lista.slice(0, 5);
                this.cargando = false;
            },
            error: (err) => {
                this.error = err?.message || 'No se pudieron cargar los productos.';
                this.cargando = false;
            }
        });
    }

    onVerCatalogoClick(): void {
        this.router.navigate(['/carta']);
    }
}
