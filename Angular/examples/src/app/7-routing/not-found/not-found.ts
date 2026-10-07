import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The 404 page. It is matched by the catch-all wildcard route (**) at the end
 * of the route table, which catches any URL that matched nothing else.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
