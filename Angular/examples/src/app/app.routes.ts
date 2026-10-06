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

  {
    path: 'components',
    loadComponent: () => import('./3-components/components/components').then((m) => m.Components),
  },

  {
    path: 'directives',
    loadComponent: () => import('./4-directives/directives/directives').then((m) => m.Directives),
  },

  {
    path: 'pipes',
    loadComponent: () => import('./5-pipes/pipe/pipe').then((m) => m.Pipe),
  },
];
