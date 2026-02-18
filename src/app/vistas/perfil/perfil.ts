import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PuntosService, Usuario, Pedido } from '../../services/puntos.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [],
    templateUrl: './perfil.html',
    styleUrl: './perfil.css'
})
export class Perfil implements OnInit { //el onInit es un metodo que se ejecuta cuando el componente se inicializa
    usuario: Usuario = { //es una variable que almacena el usuario y sus datos
        nombre: 'Eduardo',
        email: 'serranofernandoe@gmail.com',
        totalGastado: 0,
        pedidos: []
    };
    puntosTotales: number = 0; //es una variable que almacena los puntos totales del usuario
    tabActiva: string = 'compras'; //controla qué sección se muestra

    constructor( //esto es para inyectar servicios, como en spring
        private puntosService: PuntosService,
        @Inject(PLATFORM_ID) private platformId: Object //esto es para detectar si estamos en el navegador o en el servidor
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) { //si estamos en el navegador, obtenemos el usuario actual
            const userFromStorage = this.puntosService.getUsuarioActual();
            if (userFromStorage) { //si hay usuario, lo actualizamos
                this.usuario = userFromStorage;
            }
        }
        this.puntosTotales = this.puntosService.getPuntosTotales(); //calculamos los puntos totales del usuario
    }

    cambiarTab(tab: string) { //cambia la sección activa al hacer click en el nav
        this.tabActiva = tab;
    }

    simularCompra(descripcion: string, total: number) { //simulamos una compra
        const puntosPedido = this.puntosService.calcularPuntos(total); //calculamos los puntos del pedido
        const nuevoPedido: Pedido = {
            id: `#${Date.now()}`,
            fecha: new Date().toLocaleDateString('es-ES'),
            descripcion,
            total, //esto es para que se muestre el total del pedido
            estado: 'Comprado',
            puntos: puntosPedido
        };

        // Actualiza el estado local directamente
        this.usuario.pedidos.unshift(nuevoPedido);
        this.usuario.totalGastado += total;
        this.puntosTotales = this.puntosService.calcularPuntos(this.usuario.totalGastado); //calculamos los puntos totales del usuario

        // Si hay usuario en localStorage, lo guarda también
        if (isPlatformBrowser(this.platformId)) { //si estamos en el navegador, guardamos el usuario en localStorage    
            this.puntosService.añadirPedido(descripcion, total); //añadimos el pedido al usuario
        }
    }

    eliminarPedido(id: string) {
        const pedido = this.usuario.pedidos.find(p => p.id === id);
        if (pedido) {
            this.usuario.totalGastado = Math.max(0, this.usuario.totalGastado - pedido.total);
            this.usuario.pedidos = this.usuario.pedidos.filter(p => p.id !== id);
            this.puntosTotales = this.puntosService.calcularPuntos(this.usuario.totalGastado);
        }
        if (isPlatformBrowser(this.platformId)) {
            this.puntosService.eliminarPedido(id);
        }
    }
}

