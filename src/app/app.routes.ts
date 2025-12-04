// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'country/:countryName',
    loadComponent: () =>
      import('./pages/country/country.component').then(m => m.CountryComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
