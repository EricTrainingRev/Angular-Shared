import { Injectable, signal } from '@angular/core';

// A small mock of user authentication. A real app would ask a server; here a
// signal simply holds whether the user is "logged in" so the route guard can
// decide whether to allow navigation to a protected page.
@Injectable({ providedIn: 'root' })
export class AuthService {
  // The current authentication state, read with isAuthenticated(). It is a
  // signal so the template (and the guard, which re-runs on navigation) can
  // read the latest value without manual bookkeeping.
  readonly isAuthenticated = signal(false);

  login(): void {
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
