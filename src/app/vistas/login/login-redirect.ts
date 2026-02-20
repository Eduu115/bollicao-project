import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-login-redirect',
  standalone: true,
  template: ''
})
export class LoginRedirect implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Obtener returnUrl de query params si existe
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
      // Abrir el modal de login con returnUrl
      this.authModalService.openLoginModal(returnUrl);
      // Navegar a home
      this.router.navigate(['/']);
    }
  }
}
