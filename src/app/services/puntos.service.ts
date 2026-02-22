import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Pedido {
    id: string;
    fecha: string;
    descripcion: string;
    total: number;
    estado: string;
    puntos: number;
}

export interface Usuario {
    nombre: string;
    email: string;
    totalGastado: number;
    pedidos: Pedido[];
}

// Regla: 1 punto por cada 10€ gastados
const EUROS_POR_PUNTO = 10;

@Injectable({
    providedIn: 'root'
})
export class PuntosService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    private getUsuario(): Usuario | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const raw = localStorage.getItem('currentUser');
        return raw ? JSON.parse(raw) : null;
    }

     private saveUsuario(usuario: Usuario): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  setUsuarioActual(email: string, nombre?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const normalizedEmail = (email || '').trim();
    if (!normalizedEmail) return;

    const existente = this.getUsuario();
    if (existente && existente.email === normalizedEmail) return;

    const usuario: Usuario = {
      nombre: nombre ?? this.nombreDesdeEmail(normalizedEmail),
      email: normalizedEmail,
      totalGastado: 0,
      pedidos: []
    };

    this.saveUsuario(usuario);
  }

  // ✅ NUEVO: borra el usuario actual (útil para logout)
  clearUsuarioActual(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('currentUser');
  }

  // Calcula los puntos acumulados en base al total gastado
  calcularPuntos(totalGastado: number): number {
    return Math.floor(totalGastado / EUROS_POR_PUNTO);
  }

    // Añade un pedido y recalcula los puntos
    añadirPedido(descripcion: string, total: number): void {
        let usuario = this.getUsuario();
        if (!usuario) {
            // Si no existe, lo creamos con datos por defecto
            usuario = { nombre: 'Eduardo', email: 'serranofernandoe@gmail.com', totalGastado: 0, pedidos: [] };
        }

        const puntosPedido = Math.floor(total / EUROS_POR_PUNTO);
        const nuevoPedido: Pedido = {
            id: `#${Date.now()}`,
            fecha: new Date().toLocaleDateString('es-ES'),
            descripcion,
            total,
            estado: 'Procesando',
            puntos: puntosPedido
        };

        usuario.pedidos.unshift(nuevoPedido); // añade al inicio
        usuario.totalGastado = (usuario.totalGastado || 0) + total;
        this.saveUsuario(usuario);
    }

    eliminarPedido(id: string): void {
        const usuario = this.getUsuario();
        if (!usuario) return;
        const pedido = usuario.pedidos.find(p => p.id === id);
        if (pedido) {
            usuario.totalGastado = Math.max(0, usuario.totalGastado - pedido.total);
            usuario.pedidos = usuario.pedidos.filter(p => p.id !== id);
            this.saveUsuario(usuario);
        }
    }


    getPuntosTotales(): number {
        const usuario = this.getUsuario();
        if (!usuario) return 0;
        return this.calcularPuntos(usuario.totalGastado || 0);
    }

    getUsuarioActual(): Usuario | null {
        return this.getUsuario();
    }

    private nombreDesdeEmail(email: string): string {
        const base = (email.split('@')[0] || 'Usuario').trim();
        return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
    }
}
