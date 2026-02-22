import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ICliente } from './api.service';

const SESSION_KEY = 'bollicao_session';

export interface SessionUser {
    _id: string;
    nombre: string;
    email: string;
    puntosTotales: number;
    totalGastado: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    setSession(cliente: ICliente): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const session: SessionUser = {
            _id: cliente._id,
            nombre: cliente.nombre,
            email: cliente.email,
            puntosTotales: cliente.puntosTotales ?? 0,
            totalGastado: cliente.totalGastado ?? 0,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    getSession(): SessionUser | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    clearSession(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.removeItem(SESSION_KEY);
    }

    isLoggedIn(): boolean {
        return this.getSession() !== null;
    }
}
