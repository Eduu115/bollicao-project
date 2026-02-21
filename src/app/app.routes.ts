import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { Nosotros } from './vistas/nosotros/nosotros';
import { Contactanos } from './vistas/contactanos/contactanos';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil },
    { path: 'nosotros', component: Nosotros },
    { path: 'contacto', component: Contactanos },
    { path: 'contactanos', component: Contactanos },
    { path: '**', redirectTo: '' }
];


