import { Component, signal } from '@angular/core';

/**
 * Displays the main heading for the application.
 * Uses Angular's signal API to manage reactive state for the heading text.
 * This component is intended to be simple and reusable across views.
 */
@Component({
  selector: 'app-heading',
  imports: [],
  templateUrl: './heading.html',
  styleUrl: './heading.css'
})
export class Heading {

  /**
   * Reactive signal holding the heading text.
   * Can be updated dynamically if needed in future enhancements.
   */
  heading = signal("Welcome to the Pokedex!");
}
