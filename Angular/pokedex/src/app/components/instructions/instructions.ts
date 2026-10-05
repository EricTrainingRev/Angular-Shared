import { Component, signal } from '@angular/core';

/**
 * Displays a short instructional message for the user.
 * Uses Angular's signal API to manage reactive state for the instructions text.
 * This component is intended to guide users on how to interact with the Pokedex.
 */
@Component({
  selector: 'app-instructions',
  imports: [],
  templateUrl: './instructions.html',
  styleUrl: './instructions.css'
})
export class Instructions {

  /**
   * Reactive signal holding the instructional message.
   * Can be updated dynamically if needed in future enhancements.
   */
  instructions = signal("Enter the name of a Pokemon to look up its stats");
}
