import { Component, ViewEncapsulation } from '@angular/core';

/**
 * A child that demonstrates ViewEncapsulation.Emulated — Angular's default —
 * which keeps a component's own stylesheet scoped to its own elements. Angular
 * does this by adding a unique attribute to each element in this component's
 * template and rewriting this component's style selectors to include it, so the
 * rules match only these elements and cannot "leak out" and restyle other parts
 * of the app.
 *
 * The encapsulation is declared explicitly here purely to name the strategy in
 * the source; emulated is what components get out of the box.
 */
@Component({
  selector: 'app-emulated',
  imports: [],
  templateUrl: './emulated.html',
  styleUrl: './emulated.css',
  // Named explicitly because this showcase is about it, though it is the default.
  encapsulation: ViewEncapsulation.Emulated,
})
export class Emulated {}
