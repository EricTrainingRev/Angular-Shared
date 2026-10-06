import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * appHighlight is a custom ATTRIBUTE directive: it changes how an element looks
 * without altering the DOM structure. Applied as an attribute ([appHighlight]),
 * it paints its host element's background when the pointer hovers over it.
 *
 * It listens for mouseenter/mouseleave through the `host` object in the
 * @Directive decorator (the decorator-free way to attach host bindings), and
 * manipulates the host element directly through an injected ElementRef.
 */
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class Highlight {
  // The highlight color, held in a signal input. The host can pass a custom
  // color via property binding ([appHighlight]="'cyan'"). The initial value
  // 'yellow' is the default used when the input is never bound.
  //
  // A bare attribute (appHighlight) binds an empty string, not the default, so
  // the transform maps an empty value back to 'yellow'. The transform only runs
  // on values bound from the template — the initial value is used as-is.
  readonly appHighlight = input('yellow', {
    transform: (value: string) => value || 'yellow',
  });

  // A reference to the host element this directive sits on, used to change the
  // background color directly. Angular owns the element's lifetime, so there is
  // nothing to clean up here.
  private readonly element = inject(ElementRef);

  // Paint the background when the pointer enters the element.
  onMouseEnter(): void {
    this.setHighlight(this.appHighlight());
  }

  // Clear the background when the pointer leaves the element.
  onMouseLeave(): void {
    this.setHighlight(null);
  }

  // Apply (or clear) the background color on the host element.
  private setHighlight(color: string | null): void {
    // when editing an element directly like this make sure to navigate to the
    // "nativeElement" property: this is how you get access to the standard HTML element
    // properties like style, class, id, etc.
    this.element.nativeElement.style.backgroundColor = color;
  }
}
