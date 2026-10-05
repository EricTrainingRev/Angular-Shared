import { Routes } from '@angular/router';

import { App } from './angular-generated/app';

export const routes: Routes = [
  // The angular-generated welcome page, shown at the root path.
  { path: '', component: App },

  // Example feature components are added here as they are built.
  {
    path: 'templates',
    loadComponent: () => import('./2-templates/templates').then((m) => m.Templates),
  },
];
