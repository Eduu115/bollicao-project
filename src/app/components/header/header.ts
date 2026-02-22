import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';
import { UsersService } from '../../services/users.service';
import { ProfileOffcanvasService } from '../../services/profile-offcanvas.service';

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
    private usersService: UsersService,
    private profileOffcanvasService: ProfileOffcanvasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled = window.scrollY > (window.innerHeight - 86);
    }
  }

  /** Clic en el icono de perfil: abre offcanvas si hay sesión, o modal login si no */
  onProfileClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const session = this.usersService.getCurrentSession();
    if (session) {
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
