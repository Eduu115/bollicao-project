import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
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
