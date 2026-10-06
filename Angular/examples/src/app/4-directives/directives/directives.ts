import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Highlight } from '../attribute-directive/highlight';
import { If } from '../structural-directive/if';

/**
 * A showcase of Angular directives and data binding. Each section of the
 * template demonstrates one concept (built-in directives, the custom
 * attribute and structural directives, one-way binding, two-way binding),
 * and the state below is grouped to match those sections.
 */
@Component({
  selector: 'app-directives',
  imports: [FormsModule, Highlight, If],
  templateUrl: './directives.html',
  styleUrl: './directives.css',
})
export class Directives {
  // --- Built-in directives: class binding ---
  // Whether the "important" class is applied to the paragraph below. A signal
  // input drives the class binding, so toggling it re-renders the element.
  protected readonly isImportant = signal(false);

  protected toggleImportant(): void {
    this.isImportant.update((current) => !current);
  }

  // --- Built-in directives: style binding ---
  // The width of the progress bar, driven by a style binding. A signal so the
  // bar re-renders when the value changes.
  protected readonly progress = signal(40);

  protected increaseProgress(): void {
    this.progress.update((value) => Math.min(value + 10, 100));
  }

  protected decreaseProgress(): void {
    this.progress.update((value) => Math.max(value - 10, 0));
  }

  // --- Custom structural directive (appIf) ---
  // Whether the *appIf block below is rendered. The boolean isn't displayed,
  // but it still drives what the template renders, so a signal is the right
  // choice: it keeps the view in sync with the state.
  protected readonly showConditionalContent = signal(false);

  protected toggleConditionalContent(): void {
    this.showConditionalContent.update((current) => !current);
  }

  // --- One-way binding: interpolation ---
  // The name rendered by interpolation ({{ name() }}). A signal so the text
  // updates when the value changes.
  protected readonly username = signal('Billy');

  // --- One-way binding: property binding ---
  // Controls the disabled state of the button via property binding ([disabled]).
  // A plain boolean field (not a signal) is fine here since it never changes
  // in this example.
  protected isDisabled = true;

  // --- Two-way binding: ngModel ---
  // The nickname synced with the input via [(ngModel)]. A signal so the
  // displayed text updates as the user types.
  protected readonly nickname = signal('Explorer');
}
