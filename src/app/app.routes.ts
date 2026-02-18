import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil },
];
