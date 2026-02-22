import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartOffcanvasService } from '../../../services/cart-offcanvas.service';

declare var bootstrap: any;

interface CartItemDummy {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
}

@Component({
  selector: 'app-cart-offcanvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-offcanvas.html',
  styleUrl: './cart-offcanvas.css',
})
export class CartOffcanvas implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cartOffcanvas') offcanvasElement!: ElementRef;
  private offcanvasInstance: any = null;
  private sub: Subscription = new Subscription();



  //de prueba, se quitan y ya esta
  cartItems: CartItemDummy[] = [
    { id: 1, nombre: 'Tarta de Fresa Premium', precio: 35.99, imagen: '/img/placeholder.png' },
    { id: 2, nombre: 'Donuts de Caramelo Salado', precio: 12.50, imagen: '/img/placeholder.png' }
  ];

  constructor(
    private cartOffcanvasService: CartOffcanvasService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
    return this.cartItems.length;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.precio, 0);
  }

  checkout(): void {
    this.close();
    this.router.navigate(['/checkout']);
  }

  private getBootstrap(): any {
    if (typeof window === 'undefined') return null;
    if ((window as any)['bootstrap']) return (window as any)['bootstrap'];
    if (typeof bootstrap !== 'undefined') return bootstrap;
    return null;
  }
}
