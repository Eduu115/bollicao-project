import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service'; 
import { PuntosService } from '../../services/puntos.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loading = false;
  showPassword = false;
  errorMessage = '';
  private returnUrl: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private puntosService: PuntosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (isPlatformBrowser(this.platformId)) {
      this.usersService.setUsersEjemplo();

      const rememberedEmail = localStorage.getItem('remembered_email');
      if (rememberedEmail) this.form.patchValue({ email: rememberedEmail });
    }
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

    const email = (this.f.email.value || '').trim();
    const password = this.f.password.value || '';
    const remember = !!this.f.remember.value;

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

    const target =
      this.returnUrl && this.returnUrl.startsWith('/') ? this.returnUrl : '/perfil';

    this.router.navigateByUrl(target).finally(() => {
      this.loading = false;
    });
  }

  private nombreDesdeEmail(email: string): string {
    const base = (email.split('@')[0] || 'Usuario').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
  }
}