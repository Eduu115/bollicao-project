import { Routes } from '@angular/router';
import { Home } from './vistas/home/home';
import { Perfil } from './vistas/perfil/perfil';
import { Carta } from './vistas/carta/carta';
import { Unauthorized } from './vistas/unauthorized/unauthorized';
import { Checkout } from './vistas/checkout/checkout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'perfil', component: Perfil, canActivate: [authGuard] },
    { path: 'carta', component: Carta },
    { path: 'checkout', component: Checkout, canActivate: [authGuard] },
    { path: 'unauthorized', component: Unauthorized },
    { path: '**', redirectTo: '' }
];

