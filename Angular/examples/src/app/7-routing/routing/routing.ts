import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../guards/auth.service';

/**
 * A showcase of Angular routing. The app already loads example pages through
 * the router; this page adds a SECOND level of routing: a sub-navigation with
 * a nested <router-outlet /> that swaps child views (home, products, product
 * detail, and a guard-protected secret page) based on the URL.
 */
@Component({
  selector: 'app-routing',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './routing.html',
  styleUrl: './routing.css',
})
export class Routing {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // The authentication state, read straight from the shared AuthService. Both
  // this page and the route guard read the same signal, so toggling the login
  // here immediately changes what the guard allows.
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  // Login / logout toggle driven from the template. Switching state here
  // changes whether the protected "Secret" route is reachable.
  protected toggleAuth(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.authService.logout();
    } else {
      this.authService.login();
    }
  }

  // Programmatic navigation: unlike a routerLink, the decision to navigate is
  // made in code. The Router is injected and navigate() is called with a path.
  protected goToProducts(): void {
    this.router.navigate(['/routing', 'products']);
  }
}
