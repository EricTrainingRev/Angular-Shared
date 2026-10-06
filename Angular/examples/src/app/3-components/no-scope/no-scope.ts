import { Component, ViewEncapsulation } from '@angular/core';

/**
 * A child that demonstrates ViewEncapsulation.None — the counterpart to the
 * Emulated (default) strategy. With None, Angular injects this component's
 * stylesheet straight into the document head as global CSS, so every rule here
 * applies to matching elements ANYWHERE in the app, not just this component's
 * own elements.
 */
@Component({
  selector: 'app-no-scope',
  imports: [],
  templateUrl: './no-scope.html',
  styleUrl: './no-scope.css',
  // None disables encapsulation: these styles go global instead of being scoped.
  encapsulation: ViewEncapsulation.None,
})
export class NoScope {}
