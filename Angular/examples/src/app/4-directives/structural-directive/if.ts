import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * appIf is a custom STRUCTURAL directive: it adds or removes an element from
 * the DOM based on a boolean condition. Applied with the asterisk syntax
 * (*appIf="condition"), it behaves like a simplified version of the built-in
 * *ngIf.
 *
 * Unlike an attribute directive (which only changes how an element looks),
 * a structural directive controls whether the element exists at all. To do
 * that it needs two injected services:
 *   - TemplateRef: a handle to the <ng-template> that wraps the element the
 *     directive is applied to. This is the content to show.
 *   - ViewContainerRef: the anchor point in the DOM where that content can be
 *     inserted or removed. This is the place to show it.
 *
 * The condition is a signal input, so the host can bind it with property
 * binding ([appIf]="condition") or the asterisk shorthand (*appIf="condition").
 */
@Directive({
  selector: '[appIf]',
})
export class If {
  // The boolean that decides whether the template is rendered. A signal input:
  // the host binds it to a component signal, and the directive re-renders
  // whenever that value changes.
  readonly appIf = input(false);

  // The content to show: the <ng-template> Angular creates around the element
  // the directive is applied to.
  private readonly templateRef = inject(TemplateRef);

  // The anchor point in the DOM where the template is inserted or removed.
  private readonly viewContainer = inject(ViewContainerRef);

  // Whether the template is currently rendered. Tracks the DOM state so we
  // only create or clear the view when the condition actually changes, and
  // avoid redundant DOM operations on every change-detection pass.
  private hasView = false;

  constructor() {
    // React to the condition changing. Because appIf is a signal input, we
    // read it inside an effect(): Angular re-runs the effect whenever the
    // signal's value changes, so the DOM stays in sync with the condition.
    effect(() => {
      this.render(this.appIf());
    });
  }

  // Insert or remove the template based on the condition, but only when the
  // DOM state doesn't already match — this avoids touching the DOM on every
  // change-detection pass when nothing changed.
  private render(condition: boolean): void {
    if (condition && !this.hasView) {
      // Condition is true and nothing is rendered yet: create the embedded
      // view from the template and insert it at the directive's location.
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      // Condition is false but the view is still present: clear the container,
      // which removes the element from the DOM.
      this.viewContainer.clear();
      this.hasView = false;
    }
    // Otherwise the DOM already matches the condition, so there is nothing to do.
  }
}
