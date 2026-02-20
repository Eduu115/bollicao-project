import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-register-redirect',
  standalone: true,
  template: ''
})
export class RegisterRedirect implements OnInit {
  constructor(
    private router: Router,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Abrir el modal de registro y navegar a home
      this.authModalService.openRegisterModal();
      this.router.navigate(['/']);
    }
  }
}
