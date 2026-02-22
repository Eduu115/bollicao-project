import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SessionService, SessionUser } from '../../services/session.service';
import { ApiService, ICompra } from '../../services/api.service';

// Tipo local que mapea ICompra a lo que necesita el template
export interface PedidoView {
    id: string;
    fecha: string;
    descripcion: string;
    total: number;
    estado: string;
    puntos: number;
}

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil.html',
    styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
    session: SessionUser | null = null;
    pedidos: PedidoView[] = [];
    cargando = false;
    tabActiva = 'compras';

    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.session = this.sessionService.getSession();
        if (isPlatformBrowser(this.platformId) && this.session) {
            this.cargarCompras();
        }
    }

    cargarCompras(): void {
        if (!this.session) return;
        this.cargando = true;
        this.apiService.getClienteConCompras(this.session._id).subscribe({
            next: ({ compras }) => {
                this.pedidos = compras.map(c => this.mapCompra(c));
                // Actualiza puntos y gastado desde el servidor
                if (this.session) {
                    this.apiService.getCliente(this.session._id).subscribe(cliente => {
                        if (this.session) {
                            this.session = { ...this.session, puntosTotales: cliente.puntosTotales, totalGastado: cliente.totalGastado };
                            // Actualiza sessionStorage con datos frescos del servidor
                            this.sessionService.setSession(cliente);
                        }
                    });
                }
                this.cargando = false;
            },
            error: () => { this.cargando = false; }
        });
    }

    cambiarTab(tab: string): void {
        this.tabActiva = tab;
    }

    get puntosTotales(): number {
        return this.session?.puntosTotales ?? 0;
    }

    get totalGastado(): number {
        return this.session?.totalGastado ?? 0;
    }

    get nombreUsuario(): string {
        return this.session?.nombre ?? 'Usuario';
    }

    get emailUsuario(): string {
        return this.session?.email ?? '';
    }

    private mapCompra(c: ICompra): PedidoView {
        const fecha = new Date(c.fechaCompra).toLocaleDateString('es-ES');
        const descripcion = c.descripcion ?? `Pedido (${c.lineas.length} producto(s))`;
        return {
            id: c._id,
            fecha,
            descripcion,
            total: c.total,
            estado: c.estado,
            puntos: c.puntosGenerados
        };
    }
}
