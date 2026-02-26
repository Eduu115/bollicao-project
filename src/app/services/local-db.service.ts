import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IProductoLocal {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    imagen?: string;
    disponible: boolean;
    stock: number;
}

export interface IClienteLocal {
    _id: string;
    nombre: string;
    email: string;
    passwordHash: string;
    telefono?: string;
    direccion?: string;
    puntosTotales: number;
    totalGastado: number;
    activo: boolean;
    creadoEn: string;
}

export interface ICompraLocal {
    _id: string;
    cliente: string;
    lineas: { producto: string; cantidad: number; precioUnitario: number; subtotal: number }[];
    total: number;
    puntosGenerados: number;
    estado: string;
    descripcion?: string;
    fechaCompra: string;
}

// ─── Static product catalog (extracted from seed.ts) ─────────────────────────

const PRODUCTOS: IProductoLocal[] = [
    { _id: 'p01', nombre: 'Tarta de Chocolate', descripcion: 'Tarta artesanal de chocolate negro con ganache y frutos rojos', precio: 28.50, categoria: 'tarta', stock: 10, disponible: true, imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
    { _id: 'p02', nombre: 'Tarta de Zanahoria', descripcion: 'Carrot cake con frosting de queso crema y nueces', precio: 24.00, categoria: 'tarta', stock: 8, disponible: true, imagen: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop' },
    { _id: 'p03', nombre: 'Tarta de Fresas', descripcion: 'Base de bizcocho esponjoso, crema pastelera y fresas frescas de temporada', precio: 26.00, categoria: 'tarta', stock: 6, disponible: true, imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
    { _id: 'p04', nombre: 'Tarta de Queso', descripcion: 'Cheesecake al horno con base de galleta y coulis de frambuesa', precio: 22.50, categoria: 'tarta', stock: 7, disponible: true, imagen: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop' },
    { _id: 'p05', nombre: 'Tarta Red Velvet', descripcion: 'Layers de bizcocho rojo terciopelo con frosting de queso crema', precio: 30.00, categoria: 'tarta', stock: 5, disponible: true, imagen: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop' },
    { _id: 'p06', nombre: 'Croissant de Mantequilla', descripcion: 'Croissant hojaldrado con mantequilla francesa, recién horneado', precio: 2.50, categoria: 'bollo', stock: 30, disponible: true, imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' },
    { _id: 'p07', nombre: 'Bollo de Canela', descripcion: 'Bollo esponjoso con relleno de canela y glaseado de vainilla', precio: 3.00, categoria: 'bollo', stock: 25, disponible: true, imagen: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop' },
    { _id: 'p08', nombre: 'Brioche de Chocolate', descripcion: 'Pan brioche tierno relleno de crema de chocolate artesanal', precio: 3.50, categoria: 'bollo', stock: 20, disponible: true, imagen: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=300&fit=crop' },
    { _id: 'p09', nombre: 'Napolitana de Crema', descripcion: 'Hojaldre relleno de crema pastelera, glaseado con huevo', precio: 2.80, categoria: 'bollo', stock: 22, disponible: true, imagen: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop' },
    { _id: 'p10', nombre: 'Pastel de Limón', descripcion: 'Pastel suave con crema de limón y merengue tostado', precio: 18.00, categoria: 'pastel', stock: 6, disponible: true, imagen: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop' },
    { _id: 'p11', nombre: 'Pastel de Manzana', descripcion: 'Apple pie con canela, nuez moscada y masa quebrada hojaldrada', precio: 16.00, categoria: 'pastel', stock: 8, disponible: true, imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
    { _id: 'p12', nombre: 'Pastel de Coco y Lima', descripcion: 'Bizcocho de coco con crema de lima y flores comestibles', precio: 20.00, categoria: 'pastel', stock: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop' },
    { _id: 'p13', nombre: 'Galletas de Avena y Chocolate', descripcion: 'Pack de 12 galletas artesanales con pepitas de chocolate', precio: 7.50, categoria: 'galleta', stock: 20, disponible: true, imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop' },
    { _id: 'p14', nombre: 'Galletas de Mantequilla', descripcion: 'Pack de 12 galletas de mantequilla con azúcar perlado', precio: 6.50, categoria: 'galleta', stock: 25, disponible: true, imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
    { _id: 'p15', nombre: 'Macarons surtidos', descripcion: 'Caja de 6 macarons de: frambuesa, pistache, chocolate, limón, vainilla y lavanda', precio: 12.00, categoria: 'galleta', stock: 15, disponible: true, imagen: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop' },
    { _id: 'p16', nombre: 'Tarta de Cumpleaños', descripcion: 'Bizcocho de vainilla con buttercream de fresa, decorada a mano para celebraciones', precio: 35.00, categoria: 'tarta', stock: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop' },
    { _id: 'p17', nombre: 'Éclair de Café', descripcion: 'Pasta choux rellena de crema de café y glaseado oscuro brillante', precio: 3.80, categoria: 'pastel', stock: 18, disponible: true, imagen: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop' },
    { _id: 'p18', nombre: 'Brownie de Chocolate', descripcion: 'Brownie americano denso con nueces y pepitas de chocolate negro', precio: 4.00, categoria: 'pastel', stock: 20, disponible: true, imagen: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop' },
    { _id: 'p19', nombre: 'Limonada de Menta', descripcion: 'Limonada artesanal con menta fresca y sirope de agave', precio: 3.20, categoria: 'bebida', stock: 35, disponible: true, imagen: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=300&fit=crop' },
    { _id: 'p20', nombre: 'Chocolate a la Taza', descripcion: 'Chocolate puro espeso a la manera tradicional española, ideal con churros', precio: 3.50, categoria: 'bebida', stock: 45, disponible: true, imagen: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop' },
    { _id: 'p21', nombre: 'Café con Leche', descripcion: 'Café de especialidad con leche entera vaporizada', precio: 2.00, categoria: 'bebida', stock: 100, disponible: true, imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
    { _id: 'p22', nombre: 'Zumo de Naranja Natural', descripcion: 'Zumo exprimido al momento con naranjas de temporada', precio: 3.50, categoria: 'bebida', stock: 50, disponible: true, imagen: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop' },
    { _id: 'p23', nombre: 'Frapé de Fresas', descripcion: 'Batido de fresas naturales con helado de vainilla y nata', precio: 5.00, categoria: 'bebida', stock: 30, disponible: true, imagen: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop' },
    { _id: 'p24', nombre: 'Matcha Latte', descripcion: 'Leche al vapor con matcha ceremonial japonés de primera calidad', precio: 4.50, categoria: 'bebida', stock: 40, disponible: true, imagen: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop' },
];

// ─── Keys ─────────────────────────────────────────────────────────────────────

const CLIENTES_KEY = 'bollicao_clientes';
const COMPRAS_KEY = 'bollicao_compras';
const EUROS_POR_PUNTO = 10;

// ─── Helper ───────────────────────────────────────────────────────────────────

function uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class LocalDbService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    // ── Productos ──────────────────────────────────────────────────────────────

    getProductos(filtros?: { categoria?: string; disponible?: boolean }): IProductoLocal[] {
        let lista = [...PRODUCTOS];
        if (filtros?.categoria) lista = lista.filter(p => p.categoria === filtros.categoria);
        if (filtros?.disponible !== undefined) lista = lista.filter(p => p.disponible === filtros.disponible);
        return lista;
    }

    getProducto(id: string): IProductoLocal | undefined {
        return PRODUCTOS.find(p => p._id === id);
    }

    // ── Clientes ───────────────────────────────────────────────────────────────

    private loadClientes(): IClienteLocal[] {
        if (!this.isBrowser()) return [];
        const raw = localStorage.getItem(CLIENTES_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    private saveClientes(clientes: IClienteLocal[]): void {
        if (!this.isBrowser()) return;
        localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes));
    }

    getClientes(): IClienteLocal[] {
        return this.loadClientes().filter(c => c.activo);
    }

    getCliente(id: string): IClienteLocal | undefined {
        return this.loadClientes().find(c => c._id === id);
    }

    login(email: string, password: string): IClienteLocal | null {
        const cliente = this.loadClientes().find(
            c => c.email === email.trim().toLowerCase() && c.activo
        );
        if (!cliente || cliente.passwordHash !== password) return null;
        return cliente;
    }

    register(nombre: string, email: string, password: string, telefono?: string, direccion?: string): IClienteLocal | null {
        const clientes = this.loadClientes();
        const existe = clientes.find(c => c.email === email.trim().toLowerCase());
        if (existe) return null; // duplicate
        const nuevo: IClienteLocal = {
            _id: uid(),
            nombre,
            email: email.trim().toLowerCase(),
            passwordHash: password,
            telefono,
            direccion,
            puntosTotales: 0,
            totalGastado: 0,
            activo: true,
            creadoEn: new Date().toISOString(),
        };
        this.saveClientes([...clientes, nuevo]);
        return nuevo;
    }

    updateCliente(id: string, datos: Partial<IClienteLocal>): IClienteLocal | null {
        const clientes = this.loadClientes();
        const idx = clientes.findIndex(c => c._id === id);
        if (idx === -1) return null;
        const { passwordHash: _pw, _id: _id2, ...safe } = datos as any;
        clientes[idx] = { ...clientes[idx], ...safe };
        this.saveClientes(clientes);
        return clientes[idx];
    }

    // ── Compras ────────────────────────────────────────────────────────────────

    private loadCompras(): ICompraLocal[] {
        if (!this.isBrowser()) return [];
        const raw = localStorage.getItem(COMPRAS_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    private saveCompras(compras: ICompraLocal[]): void {
        if (!this.isBrowser()) return;
        localStorage.setItem(COMPRAS_KEY, JSON.stringify(compras));
    }

    getCompras(): ICompraLocal[] {
        return [...this.loadCompras()].sort(
            (a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
        );
    }

    getComprasByCliente(clienteId: string): ICompraLocal[] {
        return this.loadCompras()
            .filter(c => c.cliente === clienteId)
            .sort((a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime());
    }

    getCompra(id: string): ICompraLocal | undefined {
        return this.loadCompras().find(c => c._id === id);
    }

    createCompra(data: {
        cliente: string;
        lineas: { producto: string; cantidad: number; precioUnitario: number; subtotal: number }[];
        total: number;
        descripcion?: string;
    }): ICompraLocal {
        const puntosGenerados = Math.floor(data.total / EUROS_POR_PUNTO);
        const compra: ICompraLocal = {
            _id: uid(),
            ...data,
            puntosGenerados,
            estado: 'confirmado',
            fechaCompra: new Date().toISOString(),
        };
        this.saveCompras([...this.loadCompras(), compra]);

        // Update client points & totalGastado
        const clientes = this.loadClientes();
        const cidx = clientes.findIndex(c => c._id === data.cliente);
        if (cidx !== -1) {
            clientes[cidx].puntosTotales += puntosGenerados;
            clientes[cidx].totalGastado += data.total;
            this.saveClientes(clientes);
        }

        return compra;
    }
}
