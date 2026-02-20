import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    // Se activa cuando el navbar llega al top (hero = 100vh, navbar = 86px)
    this.scrolled = window.scrollY > (window.innerHeight - 86);
  }

  openRegisterModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authModalService.openRegisterModal();
    }
  }
}
