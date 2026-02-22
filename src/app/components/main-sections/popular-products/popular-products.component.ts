import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, IProducto } from '../../../services/api.service';

@Component({
    selector: 'app-popular-products',
    standalone: true,
    imports: [CommonModule, RouterLink, DecimalPipe],
    templateUrl: './popular-products.html',
    styleUrl: './popular-products.css'
})
export class PopularProductsComponent implements OnInit {
    productosPopulares: IProducto[] = [];

    constructor(private api: ApiService) { }

    ngOnInit(): void {
        this.api.getProductos({ disponible: true }).subscribe({
            next: (productos) => {
                this.productosPopulares = productos.slice(0, 10);
            },
            error: () => { /* silencioso */ }
        });
    }
}
