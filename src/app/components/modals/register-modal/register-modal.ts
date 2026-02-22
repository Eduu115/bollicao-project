import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';
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

  loading = false;
  errorMessage = '';
  form!: FormGroup;
  private subs = new Subscription();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private sessionService: SessionService,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    if (isPlatformBrowser(this.platformId)) {
      this.subs.add(
        this.authModalService.registerModal$.subscribe((open: boolean) => {
          if (open) setTimeout(() => this.openModal(), 50);
          else this.closeModal();
        })
      );
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.modalElement) return;
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
    if (!Bootstrap) return;
    this.modalInstance = Bootstrap.Modal.getOrCreateInstance(this.modalElement.nativeElement, {
      backdrop: 'static', keyboard: false
    });
    this.modalInstance.show();
  }

  closeModal(): void {
    this.modalInstance?.hide();
    this.errorMessage = '';
    this.form.reset();
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    const nombre = (this.form.value.nombre as string).trim();
    const email = (this.form.value.email as string).trim().toLowerCase();
    const password = this.form.value.password as string;

    this.apiService.register(nombre, email, password).subscribe({
      next: (cliente) => {
        this.sessionService.setSession(cliente);
        this.authModalService.closeRegisterModal();
        this.router.navigateByUrl('/perfil').finally(() => { this.loading = false; });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.mensaje ?? 'Error al registrar. Inténtalo de nuevo.';
      }
    });
  }

  switchToLogin(): void {
    this.authModalService.switchToLogin();
  }
}
