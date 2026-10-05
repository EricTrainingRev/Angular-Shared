import { Routes } from '@angular/router';

import { App } from './angular-generated/app';

export const routes: Routes = [
  // The angular-generated welcome page, shown at the root path.
  // this is eagerly loaded: data is stored in memory right away
  { path: '', component: App },

  // Example feature components are added here as they are built.
  {
    // this route is lazily loaded: component data is not stored in memory until it is first
    // accessed
    path: 'templates',
    loadComponent: () => import('./2-templates/templates').then((m) => m.Templates),
  },
];
