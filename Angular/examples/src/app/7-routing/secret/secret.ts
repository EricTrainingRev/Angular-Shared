import { Component } from '@angular/core';

/**
 * A protected page. Reaching it requires passing the authGuard on its route —
 * if the user is not logged in, the guard redirects back to /routing before
 * this component is ever shown.
 */
@Component({
  selector: 'app-secret',
  imports: [],
  templateUrl: './secret.html',
  styleUrl: './secret.css',
})
export class Secret {}
