import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Rol } from './core/models/barberia.models';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) 
      },
      { 
        path: 'barberos', 
        loadComponent: () => import('./features/barberos/barbero-list/barbero-list').then(m => m.BarberoListComponent),
        data: { roles: [Rol.ADMIN] }
      },
      { 
        path: 'clientes', 
        loadComponent: () => import('./features/clientes/cliente-list/cliente-list').then(m => m.ClienteListComponent),
        data: { roles: [Rol.ADMIN, Rol.BARBERO] }
      },
      { 
        path: 'servicios', 
        loadComponent: () => import('./features/servicios/servicio-list/servicio-list').then(m => m.ServicioListComponent),
        data: { roles: [Rol.ADMIN] }
      },
      { 
        path: 'citas', 
        loadComponent: () => import('./features/citas/cita-list/cita-list').then(m => m.CitaListComponent),
        data: { roles: [Rol.ADMIN, Rol.BARBERO, Rol.CLIENTE] }
      },
      { 
        path: 'horarios', 
        loadComponent: () => import('./features/horarios/horario-list/horario-list').then(m => m.HorarioListComponent),
        data: { roles: [Rol.ADMIN] }
      }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];



