import { Pipe, PipeTransform } from '@angular/core';

/**
 * square is a custom PIPE: it transforms a number into its square for display
 * in a template. A pipe is a class decorated with @Pipe that implements
 * PipeTransform, and it is used in templates with the pipe character (|):
 * {{ 5 | square }} renders 25.
 */
@Pipe({
  name: 'square',
})
export class SquarePipe implements PipeTransform {
  // PipeTransform requires a transform method: it receives the value piped in
  // and returns the transformed value that the template displays.
  transform(value: number): number {
    return value * value;
  }
}
