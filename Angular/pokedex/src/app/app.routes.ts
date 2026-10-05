import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authenticationGuard } from './guards/authentication-guard';

/**
 * Defines the application's route configuration.
 * Includes paths for login and home, with route guarding applied to the home route.
 * Redirects empty path to the login page by default.
 */
export const routes: Routes = [
  {
    path: "login",
    component: Login
  },
  {
    path: "home",
    component: Home,
    canActivate: [authenticationGuard] // Protects the home route from unauthenticated access
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full" // Ensures full path match before redirecting to avoid an infinite loop
  }
];
