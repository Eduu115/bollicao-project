import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  openRegisterModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authModalService.openRegisterModal();
    }
  }
}
