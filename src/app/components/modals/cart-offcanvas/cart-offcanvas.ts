import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartOffcanvasService } from '../../../services/cart-offcanvas.service';
import { CarritoService, LineaCarrito } from '../../../services/carrito.service';

import { AuthModalService } from '../../../services/auth-modal.service';
import { SessionService } from '../../../services/session.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cart-offcanvas',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart-offcanvas.html',
  styleUrl: './cart-offcanvas.css',
})
export class CartOffcanvas implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cartOffcanvas') offcanvasElement!: ElementRef;
  private offcanvasInstance: any = null;
  private sub: Subscription = new Subscription();

  constructor(
    private cartOffcanvasService: CartOffcanvasService,
    public carrito: CarritoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sessionService: SessionService,
    private authModalService: AuthModalService
  ) { }

  get cartItems(): LineaCarrito[] {
    return this.carrito.lineas;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.sub = this.cartOffcanvasService.offcanvasOpen$.subscribe((open: boolean) => {
      if (open) setTimeout(() => this.open(), 50);
      else this.close();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.offcanvasElement) return;
    const bs = this.getBootstrap();
    if (bs) {
      this.offcanvasInstance = new bs.Offcanvas(this.offcanvasElement.nativeElement);
      this.offcanvasElement.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        this.cartOffcanvasService.close();
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  open(): void {
    if (!this.offcanvasInstance) {
      const bs = this.getBootstrap();
      if (bs && this.offcanvasElement) {
        this.offcanvasInstance = new bs.Offcanvas(this.offcanvasElement.nativeElement);
      }
    }
    this.offcanvasInstance?.show();
  }

  close(): void {
    this.offcanvasInstance?.hide();
  }

  getTotalItems(): number {
    return this.carrito.totalItems;
  }

  getTotalPrice(): number {
    return this.carrito.total;
  }

  quitarLinea(productoId: string): void {
    this.carrito.quitar(productoId);
  }

  checkout(): void {
    this.close();
    if (!this.sessionService.isLoggedIn()) {
      this.authModalService.openLoginModal();
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  private getBootstrap(): any {
    if (typeof window === 'undefined') return null;
    if ((window as any)['bootstrap']) return (window as any)['bootstrap'];
    if (typeof bootstrap !== 'undefined') return bootstrap;
    return null;
  }
}
