import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { IProducto } from './api.service';

export interface LineaCarrito {
    producto: IProducto;
    cantidad: number;
}

const CARRITO_KEY = 'bollicao_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
    private lineasSubject = new BehaviorSubject<LineaCarrito[]>([]);
    lineas$ = this.lineasSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            const guardado = localStorage.getItem(CARRITO_KEY);
            if (guardado) this.lineasSubject.next(JSON.parse(guardado));
        }
    }

    get lineas(): LineaCarrito[] {
        return this.lineasSubject.getValue();
    }

    get totalItems(): number {
        return this.lineas.reduce((sum, l) => sum + l.cantidad, 0);
    }

    anyadir(producto: IProducto, cantidad = 1): void {
        const lineas = [...this.lineas];
        const idx = lineas.findIndex(l => l.producto._id === producto._id);
        if (idx >= 0) {
            lineas[idx] = { ...lineas[idx], cantidad: lineas[idx].cantidad + cantidad };
        } else {
            lineas.push({ producto, cantidad });
        }
        this.guardar(lineas);
    }

    quitar(productoId: string): void {
        this.guardar(this.lineas.filter(l => l.producto._id !== productoId));
    }

    cambiarCantidad(productoId: string, cantidad: number): void {
        if (cantidad <= 0) { this.quitar(productoId); return; }
        this.guardar(this.lineas.map(l =>
            l.producto._id === productoId ? { ...l, cantidad } : l
        ));
    }

    limpiar(): void {
        this.guardar([]);
    }

    get total(): number {
        return this.lineas.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
    }

    private guardar(lineas: LineaCarrito[]): void {
        this.lineasSubject.next(lineas);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(CARRITO_KEY, JSON.stringify(lineas));
        }
    }
}
