import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { LocalDbService, IProductoLocal, IClienteLocal, ICompraLocal } from './local-db.service';

// ─── Re-export interfaces (names kept identical so components don't change) ───

export interface ICliente {
    _id: string;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    puntosTotales: number;
    totalGastado: number;
    activo: boolean;
    creadoEn: string;
}

export interface IProducto {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    imagen?: string;
    disponible: boolean;
    stock: number;
}

export interface ICompra {
    _id: string;
    cliente: string | ICliente;
    lineas: { producto: string | IProducto; cantidad: number; precioUnitario: number; subtotal: number }[];
    total: number;
    puntosGenerados: number;
    estado: string;
    descripcion?: string;
    fechaCompra: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toCliente(c: IClienteLocal): ICliente {
    const { passwordHash: _, ...rest } = c as any;
    return rest as ICliente;
}

function toProducto(p: IProductoLocal): IProducto {
    return p as IProducto;
}

function toCompra(c: ICompraLocal): ICompra {
    return c as unknown as ICompra;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private db: LocalDbService) { }

    // ── Auth ───────────────────────────────────────────────────────────────────

    login(email: string, password: string): Observable<ICliente> {
        const cliente = this.db.login(email, password);
        if (!cliente) return throwError(() => ({ error: { mensaje: 'Correo o contraseña incorrectos' } }));
        return of(toCliente(cliente));
    }

    register(nombre: string, email: string, password: string): Observable<ICliente> {
        const cliente = this.db.register(nombre, email, password);
        if (!cliente) return throwError(() => ({ error: { mensaje: 'Ya existe un cliente con ese email' } }));
        return of(toCliente(cliente));
    }

    // ── Clientes ───────────────────────────────────────────────────────────────

    getClientes(): Observable<ICliente[]> {
        return of(this.db.getClientes().map(toCliente));
    }

    getCliente(id: string): Observable<ICliente> {
        const c = this.db.getCliente(id);
        if (!c) return throwError(() => ({ error: { mensaje: 'Cliente no encontrado' } }));
        return of(toCliente(c));
    }

    getClienteConCompras(id: string): Observable<{ cliente: ICliente; compras: ICompra[] }> {
        const cliente = this.db.getCliente(id);
        if (!cliente) return throwError(() => ({ error: { mensaje: 'Cliente no encontrado' } }));
        const compras = this.db.getComprasByCliente(id).map(c => {
            // Populate lineas with full producto objects
            const lineasPobladas = c.lineas.map(l => ({
                ...l,
                producto: this.db.getProducto(l.producto) ?? l.producto,
            }));
            return { ...toCompra(c), lineas: lineasPobladas } as ICompra;
        });
        return of({ cliente: toCliente(cliente), compras });
    }

    updateCliente(id: string, datos: Partial<ICliente>): Observable<ICliente> {
        const actualizado = this.db.updateCliente(id, datos as any);
        if (!actualizado) return throwError(() => ({ error: { mensaje: 'Cliente no encontrado' } }));
        return of(toCliente(actualizado));
    }

    // ── Productos ──────────────────────────────────────────────────────────────

    getProductos(filtros?: { categoria?: string; disponible?: boolean; noCache?: boolean }): Observable<IProducto[]> {
        return of(this.db.getProductos(filtros).map(toProducto));
    }

    getProducto(id: string): Observable<IProducto> {
        const p = this.db.getProducto(id);
        if (!p) return throwError(() => ({ error: { mensaje: 'Producto no encontrado' } }));
        return of(toProducto(p));
    }

    // ── Compras ────────────────────────────────────────────────────────────────

    getCompras(): Observable<ICompra[]> {
        return of(this.db.getCompras().map(toCompra));
    }

    getCompra(id: string): Observable<ICompra> {
        const c = this.db.getCompra(id);
        if (!c) return throwError(() => ({ error: { mensaje: 'Compra no encontrada' } }));
        return of(toCompra(c));
    }

    createCompra(data: Partial<ICompra>): Observable<ICompra> {
        const compra = this.db.createCompra({
            cliente: data.cliente as string,
            lineas: (data.lineas ?? []).map(l => ({
                producto: (typeof l.producto === 'string' ? l.producto : (l.producto as IProducto)._id),
                cantidad: l.cantidad,
                precioUnitario: l.precioUnitario,
                subtotal: l.subtotal,
            })),
            total: data.total ?? 0,
            descripcion: data.descripcion,
        });
        return of(toCompra(compra));
    }

    updateCompra(id: string, data: Partial<ICompra>): Observable<ICompra> {
        const compra = this.db.getCompra(id);
        if (!compra) return throwError(() => ({ error: { mensaje: 'Compra no encontrada' } }));
        return of(toCompra(compra));
    }
}