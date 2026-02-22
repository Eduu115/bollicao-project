import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { Nosotros } from './vistas/nosotros/nosotros';
import { Contactanos } from './vistas/contactanos/contactanos';
import { Carta } from './vistas/carta/carta';
import { Unauthorized } from './vistas/unauthorized/unauthorized';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
    { path: 'nosotros', component: Nosotros },
    { path: 'contacto', component: Contactanos },
    { path: 'contactanos', component: Contactanos },
    { path: 'carta', component: Carta },
    { path: 'unauthorized', component: Unauthorized },
    { path: '**', redirectTo: '' }
];

