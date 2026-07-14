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
import { MascotaForm } from './features/mascotas/mascota-form/mascota-form';
import { MascotaList } from './features/mascotas/mascota-list/mascota-list';
import { CitaForm } from './features/citas/cita-form/cita-form';
import { CitaList } from './features/citas/cita-list/cita-list';
import { AtencionForm } from './features/atenciones/atencion-form/atencion-form';
import { AtencionList } from './features/atenciones/atencion-list/atencion-list';
import { RecetaForm } from './features/recetas/receta-form/receta-form';
import { RecetaList } from './features/recetas/receta-list/receta-list';

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
    path: 'mascotas',
    component: MascotaList,
    canActivate: [authGuard],
  },
  {
    path: 'mascotas/nueva',
    component: MascotaForm,
    canActivate: [authGuard],
  },
  {
    path: 'mascotas/:id/editar',
    component: MascotaForm,
    canActivate: [authGuard],
  },
  {
    path: 'citas',
    component: CitaList,
    canActivate: [authGuard],
  },
  {
    path: 'citas/nueva',
    component: CitaForm,
    canActivate: [authGuard],
  },
  {
    path: 'citas/:id/editar',
    component: CitaForm,
    canActivate: [authGuard],
  },
  {
    path: 'atenciones',
    component: AtencionList,
    canActivate: [authGuard],
  },
  {
    path: 'atenciones/nueva',
    component: AtencionForm,
    canActivate: [authGuard],
  },
  {
    path: 'atenciones/:id/editar',
    component: AtencionForm,
    canActivate: [authGuard],
  },
  {
    path: 'recetas',
    component: RecetaList,
    canActivate: [authGuard],
  },
  {
    path: 'recetas/nueva',
    component: RecetaForm,
    canActivate: [authGuard],
  },
  {
    path: 'recetas/:id/editar',
    component: RecetaForm,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];