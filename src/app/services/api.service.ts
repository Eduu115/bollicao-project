import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly base = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // ── AUTH ──────────────────────────────────────────────────────────────────

    login(email: string, password: string): Observable<ICliente> {
        return this.http.post<ICliente>(`${this.base}/clientes/login`, { email, password });
    }

    register(nombre: string, email: string, password: string): Observable<ICliente> {
        return this.http.post<ICliente>(`${this.base}/clientes/register`, { nombre, email, password });
    }

    // ── CLIENTES ──────────────────────────────────────────────────────────────

    getClientes(): Observable<ICliente[]> {
        return this.http.get<ICliente[]>(`${this.base}/clientes`);
    }

    getCliente(id: string): Observable<ICliente> {
        return this.http.get<ICliente>(`${this.base}/clientes/${id}`);
    }

    getClienteConCompras(id: string): Observable<{ cliente: ICliente; compras: ICompra[] }> {
        return this.http.get<{ cliente: ICliente; compras: ICompra[] }>(`${this.base}/clientes/${id}/compras`);
    }

    updateCliente(id: string, datos: Partial<ICliente>): Observable<ICliente> {
        return this.http.put<ICliente>(`${this.base}/clientes/${id}`, datos);
    }

    // ── PRODUCTOS ─────────────────────────────────────────────────────────────

    getProductos(filtros?: { categoria?: string; disponible?: boolean; noCache?: boolean }): Observable<IProducto[]> {
        let url = `${this.base}/productos`;
        const params: string[] = [];
        if (filtros?.categoria) params.push(`categoria=${filtros.categoria}`);
        if (filtros?.disponible !== undefined) params.push(`disponible=${filtros.disponible}`);
        if (filtros?.noCache) params.push(`_t=${Date.now()}`); // Evita caché de SSR/HttpClient
        if (params.length) url += `?${params.join('&')}`;
        return this.http.get<IProducto[]>(url);
    }

    getProducto(id: string): Observable<IProducto> {
        return this.http.get<IProducto>(`${this.base}/productos/${id}`);
    }

    // ── COMPRAS ───────────────────────────────────────────────────────────────

    getCompras(): Observable<ICompra[]> {
        return this.http.get<ICompra[]>(`${this.base}/compras`);
    }

    getCompra(id: string): Observable<ICompra> {
        return this.http.get<ICompra>(`${this.base}/compras/${id}`);
    }

    createCompra(data: Partial<ICompra>): Observable<ICompra> {
        return this.http.post<ICompra>(`${this.base}/compras`, data);
    }

    updateCompra(id: string, data: Partial<ICompra>): Observable<ICompra> {
        return this.http.put<ICompra>(`${this.base}/compras/${id}`, data);
    }
}
