import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Heading } from "./components/heading/heading";

/**
 * Root component of the application.
 * Sets up the layout and routing outlet for rendering child views.
 * Includes static components like heading and search, and uses signals for reactive state.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Heading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  /**
   * Reactive signal holding the application title.
   * Can be used for dynamic updates or metadata binding.
   */
  protected readonly title = signal('pokedex');

  constructor() {}
}
