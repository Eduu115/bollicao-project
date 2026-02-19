import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service'; // ajusta ruta/nombre real
import { PuntosService } from '../../services/puntos.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  form!: FormGroup;
  errorMessage = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private puntosService: PuntosService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.usersService.setUsersEjemplo();
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
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

    this.router.navigateByUrl('/perfil');
  }

  private nombreDesdeEmail(email: string): string {
    const base = (email.split('@')[0] || 'Usuario').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuario';
  }
}