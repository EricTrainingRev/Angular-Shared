import { Routes } from '@angular/router';

import { App } from './angular-generated/app';
import { authGuard } from './7-routing/guards/auth.guard';
import { NotFound } from './7-routing/not-found/not-found';
import { ProductDetail } from './7-routing/products/product-detail';
import { Products } from './7-routing/products/products';
import { RoutingHome } from './7-routing/routing-home/routing-home';
import { Secret } from './7-routing/secret/secret';

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

  {
    path: 'communication',
    loadComponent: () =>
      import('./6-communication/communication/communication').then((m) => m.Communication),
  },

  // The routing demo loads lazily and hosts its own nested (child) routes. The
  // child views render in the <router-outlet /> inside the Routing component.
  {
    path: 'routing',
    loadComponent: () => import('./7-routing/routing/routing').then((m) => m.Routing),
    children: [
      { path: '', component: RoutingHome },
      { path: 'products', component: Products },
      // url identifiers must be declared, query params are not declared
      { path: 'product/:id', component: ProductDetail },
      // The Secret route is protected by a CanActivate guard: when not logged
      // in, authGuard redirects to /routing instead of showing this page.
      { path: 'secret', component: Secret, canActivate: [authGuard] },
    ],
    /*
      Query params go in their own section. From the docs:
        // Single parameter structure
        // /products?category=electronics
        router.navigate(['/products'], {
          queryParams: {category: 'electronics'},
        });

        // Multiple parameters
        // /products?category=electronics&sort=price&page=1
        router.navigate(['/products'], {
          queryParams: {
            category: 'electronics',
            sort: 'price',
            page: 1,
          },
        });
    */
  },

  {
    path: 'services-di',
    loadComponent: () =>
      import('./8-services-di/services-di/services-di').then((m) => m.ServicesDI),
  },

  {
    path: 'async-http',
    loadComponent: () =>
      import('./9-async-http/async-http/async-http').then((m) => m.AsyncHTTP),
  },

  // this is a fallback view if a user tries to go to a route that does not exist
  { path: '**', component: NotFound },
];
