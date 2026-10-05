import { Component, signal } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Card } from '../card/card';

// used in the @switch control flow example below
type Status = 'loading' | 'ready' | 'error';

/**
 * A showcase of Angular template features. Each section of the template
 * demonstrates one concept (template statements, template reference
 * variables, @ control flow, ng-container, ng-template, content projection),
 * and the state below is grouped to match those sections.
 */
@Component({
  selector: 'app-templates',
  imports: [Card, NgIf, NgTemplateOutlet],
  templateUrl: './templates.html',
  styleUrl: './templates.css',
})
export class Templates {
  // --- Template statements: counter ---
  // A signal is a reactive container for a value. When the value changes,
  // Angular automatically re-renders anything that reads it (via the () call
  // in the template). We use signals for state that the template displays,
  // so the UI stays in sync with the data without manual updates.
  // The counter value shown in the template statements section.
  // Demonstrates interpolation ({{ counterValue() }}) and event binding ((click)).
  protected readonly counterValue = signal(0);

  protected increment(): void {
    this.counterValue.update((c) => c + 1);
  }

  protected decrement(): void {
    this.counterValue.update((c) => c - 1);
  }

  // --- Template statements: keyup + $event ---
  // Holds whatever the user types in the input, updated on each keyup.
  // Demonstrates event binding with the $event object.
  protected readonly typedText = signal('');

  protected onKeyUp(event: Event): void {
    this.typedText.set((event.target as HTMLInputElement).value);
  }

  // --- Template statements: property binding ---
  // Controls the disabled state of the button via property binding ([disabled]).
  // A plain boolean field (not a signal) is fine here since it never changes
  // in this example.
  protected isDisabled = true;

  // --- Template reference variables ---
  // The value read from the #phone element via a template reference variable.
  protected readonly phoneValue = signal('');

  // --- @if / @else control flow ---
  // Whether the @if block shows its "visible" branch or the @else branch.
  // The boolean itself isn't displayed, but it still drives what the template
  // renders, so a signal is the right choice: it keeps the view in sync with
  // the state no matter where the change comes from.
  protected readonly showConditionalContent = signal(false);

  protected toggleConditionalContent(): void {
    this.showConditionalContent.update((currentBoolean) => !currentBoolean);
  }

  // --- @for control flow ---
  // The list rendered by the @for block in the control-flow section.
  protected readonly exampleTopics = signal(['Signals', 'Templates', 'Directives', 'Routing']);

  // --- @switch control flow ---
  // The current status rendered by the @switch block.
  protected readonly requestStatus = signal<Status>('ready');

  protected setRequestStatus(next: Status): void {
    this.requestStatus.set(next);
  }

  // --- ng-container ---
  // Whether the grouped lines inside the ng-container are shown.
  protected readonly showGroupedContent = signal(false);

  protected toggleGroupedContent(): void {
    this.showGroupedContent.update((v) => !v);
  }

  // --- ng-template via NgTemplateOutlet ---
  // The text rendered by the reusable ng-template.
  protected readonly greeting = signal('Hello from a reusable template!');
}
