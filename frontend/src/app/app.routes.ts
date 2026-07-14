import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { ClienteForm } from './features/clientes/cliente-form/cliente-form';
import { ClienteList } from './features/clientes/cliente-list/cliente-list';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { EspecialidadForm } from './features/especialidades/especialidad-form/especialidad-form';
import { EspecialidadList } from './features/especialidades/especialidad-list/especialidad-list';
import { VeterinarioForm } from './features/veterinarios/veterinario-form/veterinario-form';
import { VeterinarioList } from './features/veterinarios/veterinario-list/veterinario-list';

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
    path: 'especialidades',
    component: EspecialidadList,
    canActivate: [authGuard],
  },
  {
    path: 'especialidades/nueva',
    component: EspecialidadForm,
    canActivate: [authGuard],
  },
  {
    path: 'especialidades/:id/editar',
    component: EspecialidadForm,
    canActivate: [authGuard],
  },
  {
    path: 'veterinarios',
    component: VeterinarioList,
    canActivate: [authGuard],
  },
  {
    path: 'veterinarios/nuevo',
    component: VeterinarioForm,
    canActivate: [authGuard],
  },
  {
    path: 'veterinarios/:id/editar',
    component: VeterinarioForm,
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