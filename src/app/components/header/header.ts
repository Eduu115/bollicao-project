import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';
import { SessionService } from '../../services/session.service';
import { ProfileOffcanvasService } from '../../services/profile-offcanvas.service';
import { CartOffcanvasService } from '../../services/cart-offcanvas.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  scrolled = false;

  constructor(
    private authModalService: AuthModalService,
    private sessionService: SessionService,
    private profileOffcanvasService: ProfileOffcanvasService,
    private cartOffcanvasService: CartOffcanvasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > (window.innerHeight - 86);
    }
  }

  onCartClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
      this.cartOffcanvasService.open();
  }

  /** Abre offcanvas si hay sesión activa, o modal de login si no */
  onProfileClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.sessionService.isLoggedIn()) {
      this.profileOffcanvasService.open();
    } else {
      this.authModalService.openLoginModal();
    }
  }

  openRegisterModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authModalService.openRegisterModal();
    }
  }
}
