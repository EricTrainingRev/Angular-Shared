import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../services/user';

/**
 * Route guard that checks if the user is authenticated before allowing access to a route.
 * If the user is not logged in, they are redirected to the login page.
 * 
 * This guard uses Angular's functional `CanActivateFn` approach introduced in Angular 15+.
 */
export const authenticationGuard: CanActivateFn = (route, state) => {
  // Inject the User service to check authentication status.
  const userService = inject(User);

  // Inject the Router to perform navigation if the user is not authenticated.
  const router = inject(Router);

  // Check if the user is logged in.
  if (userService.isLoggedIn()) {
    return true; // Allow route activation.
  } else {
    router.navigate(["login"]); // Redirect to login page.
    return false; // Block route activation.
  }
};
