import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { LoginRedirect } from './vistas/login/login-redirect';
import { RegisterRedirect } from './vistas/register/register-redirect';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil },
    { path: 'login', component: LoginRedirect },
    { path: 'registro', component: RegisterRedirect },
    { path: '**', redirectTo: '' }
];


