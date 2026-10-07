import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The default child view shown at the /routing path. It introduces the nested
 * outlet and demonstrates declarative navigation (RouterLink), including the
 * array syntax used to build a route with a parameter.
 */
@Component({
  selector: 'app-routing-home',
  imports: [RouterLink],
  templateUrl: './routing-home.html',
  styleUrl: './routing-home.css',
})
export class RoutingHome {}
