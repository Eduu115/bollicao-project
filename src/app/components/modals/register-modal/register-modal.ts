import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css'
})
export class RegisterModal implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('registerModal') modalElement!: ElementRef;
  private modalInstance: any = null;

  form!: FormGroup;
  errorMessage = '';

  // Gestión de suscripciones para evitar leaks
  private subs = new Subscription();

  constructor(
    private router: Router,
    private usersService: UsersService,
    private puntosService: PuntosService,
    private fb: FormBuilder,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.usersService.setUsersEjemplo();
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    if (isPlatformBrowser(this.platformId)) {
      this.subs.add(
        this.authModalService.registerModal$.subscribe((open: boolean) => {
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

    // Sincroniza el servicio cuando el usuario cierra con botón X de Bootstrap
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.authModalService.closeRegisterModal();
    });
  }

  ngOnDestroy(): void {
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

  submit(): void {
    this.errorMessage = '';

    if (!isPlatformBrowser(this.platformId)) {
      this.errorMessage = 'El registro solo está disponible en el navegador.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = (this.form.value.email as string).trim().toLowerCase();
    const password = this.form.value.password as string;

    const created = this.usersService.registerUser
      ? this.usersService.registerUser(email, password)
      : null;

    const user = created ?? { email, password };

    if (!created) {
      this.usersService.addUser(user);
    }

    this.usersService.setCurrentSession(user);
    this.puntosService.setUsuarioActual(user.email, this.nombreDesdeEmail(user.email));

    this.authModalService.closeRegisterModal();
    this.router.navigateByUrl('/perfil');
  }

  switchToLogin(): void {
    this.authModalService.switchToLogin();
  }

  private nombreDesdeEmail(email: string): string {
    const base = (email.split('@')[0] || 'Usuario').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
  }
}
