import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { screen: 'home' },
  },
  {
    path: 'perfil',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { screen: 'profile' },
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { screen: 'projects' },
  },
  {
    path: 'github',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { screen: 'github' },
  },
  {
    path: 'contacto',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { screen: 'contact' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
