import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { Login } from './vistas/login/login';
import { Register } from './vistas/register/register';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil },
    { path: 'login', component: Login },
    { path: 'registro', component: Register },
    { path: '**', redirectTo: '' }
];


