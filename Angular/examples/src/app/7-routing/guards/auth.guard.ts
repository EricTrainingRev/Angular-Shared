import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

// A functional CanActivate guard. It runs BEFORE the route is activated and
// decides whether navigation may proceed. Returning true allows the route;
// returning a UrlTree redirects instead.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not logged in: redirect to the routing home. The app has no real login
  // page, so we send the user back to the demo instead of a /login route.
  return router.createUrlTree(['/routing']);
};
