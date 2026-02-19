import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service'; // ajusta ruta/nombre real
import { PuntosService } from '../../services/puntos.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private puntosService: PuntosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.usersService.setUsersEjemplo();
    }
  }

  register(): void {
    this.errorMessage = '';

    if (!isPlatformBrowser(this.platformId)) {
      this.errorMessage = 'El registro solo está disponible en el navegador.';
      return;
    }

    const email = this.email.trim().toLowerCase();
    const password = this.password;


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