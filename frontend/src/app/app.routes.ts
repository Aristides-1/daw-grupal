import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

import { Login } from './features/auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';

import { Dashboard } from './features/dashboard/dashboard/dashboard';

import { ClienteForm } from './features/clientes/cliente-form/cliente-form';
import { ClienteList } from './features/clientes/cliente-list/cliente-list';

import { MascotaForm } from './features/mascotas/mascota-form/mascota-form';
import { MascotaList } from './features/mascotas/mascota-list/mascota-list';

import { EspecialidadForm } from './features/especialidades/especialidad-form/especialidad-form';
import { EspecialidadList } from './features/especialidades/especialidad-list/especialidad-list';

import { VeterinarioForm } from './features/veterinarios/veterinario-form/veterinario-form';
import { VeterinarioList } from './features/veterinarios/veterinario-list/veterinario-list';

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
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'clientes',
        component: ClienteList,
      },
      {
        path: 'clientes/nuevo',
        component: ClienteForm,
      },
      {
        path: 'clientes/:id/editar',
        component: ClienteForm,
      },
      {
        path: 'mascotas',
        component: MascotaList,
      },
      {
        path: 'mascotas/nueva',
        component: MascotaForm,
      },
      {
        path: 'mascotas/:id/editar',
        component: MascotaForm,
      },
      {
        path: 'especialidades',
        component: EspecialidadList,
      },
      {
        path: 'especialidades/nueva',
        component: EspecialidadForm,
      },
      {
        path: 'especialidades/:id/editar',
        component: EspecialidadForm,
      },
      {
        path: 'veterinarios',
        component: VeterinarioList,
      },
      {
        path: 'veterinarios/nuevo',
        component: VeterinarioForm,
      },
      {
        path: 'veterinarios/:id/editar',
        component: VeterinarioForm,
      },
      {
        path: 'citas',
        component: CitaList,
      },
      {
        path: 'citas/nueva',
        component: CitaForm,
      },
      {
        path: 'citas/:id/editar',
        component: CitaForm,
      },
      {
        path: 'atenciones',
        component: AtencionList,
      },
      {
        path: 'atenciones/nueva',
        component: AtencionForm,
      },
      {
        path: 'atenciones/:id/editar',
        component: AtencionForm,
      },
      {
        path: 'recetas',
        component: RecetaList,
      },
      {
        path: 'recetas/nueva',
        component: RecetaForm,
      },
      {
        path: 'recetas/:id/editar',
        component: RecetaForm,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];