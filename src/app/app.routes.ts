import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./features/perfil/perfil.module').then((m) => m.PerfilModule)
  },
  {
    path: 'levantamentos',
    loadChildren: () => import('./features/levantamentos/levantamentos.module').then((m) => m.LevantamentosModule)
  },
  {
    path: 'individuos',
    loadChildren: () => import('./features/individuos/individuos.module').then((m) => m.IndividuosModule)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
