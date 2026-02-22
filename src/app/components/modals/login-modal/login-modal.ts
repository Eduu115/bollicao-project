import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { PuntosService } from '../../../services/puntos.service';
import { AuthModalService } from '../../../services/auth-modal.service';

declare var bootstrap: any;

function getBootstrap(): any {
  if (typeof window === 'undefined') return null;
  if ((window as any)['bootstrap']) return (window as any)['bootstrap'];
  if (typeof bootstrap !== 'undefined') return bootstrap;
  return null;
}

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css'
})
export class LoginModal implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loginModal') modalElement!: ElementRef;
  private modalInstance: any = null;

  loading = false;
  showPassword = false;
  errorMessage = ''
  form!: FormGroup;
  private returnUrl: string | null = null;

  // Gestión de suscripciones para evitar leaks
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private puntosService: PuntosService,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });

    if (isPlatformBrowser(this.platformId)) {
      this.usersService.setUsersEjemplo();

      const rememberedEmail = localStorage.getItem('remembered_email');
      if (rememberedEmail) this.form.patchValue({ email: rememberedEmail });

      this.subs.add(
        this.authModalService.returnUrl$.subscribe(url => {
          this.returnUrl = url;
        })
      );

      this.subs.add(
        this.authModalService.loginModal$.subscribe((open: boolean) => {
          if (open) {
            setTimeout(() => this.openModal(), 50);
          } else {
            this.closeModal();
          }
        })
      );
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.modalElement) return;

    // Escuchar el evento de Bootstrap para cuando el usuario cierra con el botón X
    // Así reseteamos el servicio y evitamos estado incoherente
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.authModalService.closeLoginModal();
    });
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones al destruirse el componente
    this.subs.unsubscribe();
  }

  openModal(): void {
    if (!isPlatformBrowser(this.platformId) || !this.modalElement) return;

    const Bootstrap = getBootstrap();
    if (!Bootstrap) {
      console.error('Bootstrap is not loaded');
      return;
    }

    this.modalInstance = Bootstrap.Modal.getOrCreateInstance(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
    this.modalInstance.show();
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.errorMessage = '';
    this.form.reset();
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    this.errorMessage = '';

    if (!isPlatformBrowser(this.platformId)) {
      this.errorMessage = 'El login solo está disponible en el navegador.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = (this.f['email'].value || '').trim();
    const password = this.f['password'].value || '';
    const remember = !!this.f['remember'].value;

    const user = this.usersService.findUserByEmailAndPassword(email, password);

    if (!user) {
      this.loading = false;
      this.errorMessage = 'Correo o contraseña incorrectos.';
      return;
    }

    this.usersService.setCurrentSession(user);
    this.puntosService.setUsuarioActual(user.email, this.nombreDesdeEmail(user.email));

    if (remember) localStorage.setItem('remembered_email', user.email);
    else localStorage.removeItem('remembered_email');

    this.authModalService.closeLoginModal();
    const target = this.returnUrl && this.returnUrl.startsWith('/') ? this.returnUrl : '/perfil';
    this.router.navigateByUrl(target).finally(() => {
      this.loading = false;
    });
  }

  switchToRegister(): void {
    this.authModalService.switchToRegister();
  }

  private nombreDesdeEmail(email: string): string {
    const base = (email.split('@')[0] || 'Usuario').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
  }
}
