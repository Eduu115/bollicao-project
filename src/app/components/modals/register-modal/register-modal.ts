import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { PuntosService } from '../../../services/puntos.service';
import { AuthModalService } from '../../../services/auth-modal.service';

declare var bootstrap: any;

// Asegurar acceso a bootstrap desde window
function getBootstrap(): any {
  if (typeof window === 'undefined') {
    return null;
  }
  // Bootstrap puede estar en window.bootstrap o como variable global
  if ((window as any).bootstrap) {
    return (window as any).bootstrap;
  }
  if (typeof bootstrap !== 'undefined') {
    return bootstrap;
  }
  return null;
}

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css'
})
export class RegisterModal implements OnInit, AfterViewInit {
  @ViewChild('registerModal') modalElement!: ElementRef;
  private modalInstance: any;

  form!: FormGroup;
  errorMessage = '';

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

    // Suscribirse a los cambios del servicio
    this.authModalService.registerModal$.subscribe(open => {
      if (open) {
        // Esperar a que el ViewChild esté disponible
        setTimeout(() => this.openModal(), 100);
      } else {
        this.closeModal();
      }
    });
  }

  ngAfterViewInit(): void {
    // No se instancia aquí; se usa getOrCreateInstance en openModal.
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

    this.closeModal();
    this.router.navigateByUrl('/perfil');
  }

  switchToLogin(): void {
    this.closeModal();
    this.authModalService.switchToLogin();
  }

  private nombreDesdeEmail(email: string): string {
    const base = (email.split('@')[0] || 'Usuario').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
  }
}
