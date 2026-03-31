import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'barberos', loadComponent: () => import('./features/barberos/barbero-list/barbero-list').then(m => m.BarberoListComponent) },
  { path: 'clientes', loadComponent: () => import('./features/clientes/cliente-list/cliente-list').then(m => m.ClienteListComponent) },
  { path: 'servicios', loadComponent: () => import('./features/servicios/servicio-list/servicio-list').then(m => m.ServicioListComponent) },
];
