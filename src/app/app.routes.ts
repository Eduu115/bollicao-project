import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { Login } from './vistas/login/login';
import { Registro } from './vistas/registro/registro';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: '**', redirectTo: '' }
];


