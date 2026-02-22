import { Component, Inject, PLATFORM_ID, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService, IProducto } from '../../services/api.service';
import { SessionService } from '../../services/session.service';
import { AuthModalService } from '../../services/auth-modal.service';

import { AboutUsComponent } from '../main-sections/about-us/about-us.component';
import { FeatureStripComponent } from '../main-sections/feature-strip/feature-strip.component';
import { PopularProductsComponent } from '../main-sections/popular-products/popular-products.component';
import { StoreSectionComponent } from '../main-sections/store-section/store-section.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    AboutUsComponent,
    FeatureStripComponent,
    PopularProductsComponent,
    StoreSectionComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
export class Main implements OnInit, OnDestroy, AfterViewInit {
  productos: IProducto[] = [];
  cargando = true;
  error = '';
  private sub?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private sessionService: SessionService,
    private authModalService: AuthModalService,
    private router: Router
  ) { }

  onVerCatalogoClick(): void {
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/carta']);
    } else {
      this.authModalService.openLoginModal('/carta');
    }
  }

  ngOnInit(): void {
    this.sub = this.apiService.getProductos({ disponible: true }).subscribe({
      next: (p) => {
        this.productos = p.slice(0, 5);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap && bootstrap.ScrollSpy) {
        bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
          target: '#navbar-scrollspy',
          rootMargin: '0px 0px -40%'
        });
      }
    }
  }
}
