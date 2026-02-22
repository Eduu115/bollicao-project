import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  errorMessage = '';
  form!: FormGroup;
  private returnUrl: string | null = null;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sessionService: SessionService,
    private authModalService: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: [false],
    });

    if (isPlatformBrowser(this.platformId)) {
      const rememberedEmail = localStorage.getItem('remembered_email');
      if (rememberedEmail) this.form.patchValue({ email: rememberedEmail });

      this.subs.add(
        this.authModalService.returnUrl$.subscribe(url => { this.returnUrl = url; })
      );

      this.subs.add(
        this.authModalService.loginModal$.subscribe((open: boolean) => {
          if (open) setTimeout(() => this.openModal(), 50);
          else this.closeModal();
        })
      );
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.modalElement) return;
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.authModalService.closeLoginModal();
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

  get f() { return this.form.controls; }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    const email = (this.f['email'].value as string).trim();
    const password = this.f['password'].value as string;
    const remember = !!this.f['remember'].value;

    this.apiService.login(email, password).subscribe({
      next: (cliente) => {
        this.sessionService.setSession(cliente);
        if (remember) localStorage.setItem('remembered_email', email);
        else localStorage.removeItem('remembered_email');
        this.authModalService.closeLoginModal();
        const target = this.returnUrl?.startsWith('/') ? this.returnUrl : '/perfil';
        this.router.navigateByUrl(target).finally(() => { this.loading = false; });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.mensaje ?? 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    });
  }

  switchToRegister(): void {
    this.authModalService.switchToRegister();
  }
}
