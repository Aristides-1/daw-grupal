import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { ClienteForm } from './features/clientes/cliente-form/cliente-form';
import { ClienteList } from './features/clientes/cliente-list/cliente-list';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    component: ClienteList,
    canActivate: [authGuard],
  },
  {
    path: 'clientes/nuevo',
    component: ClienteForm,
    canActivate: [authGuard],
  },
  {
    path: 'clientes/:id/editar',
    component: ClienteForm,
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];