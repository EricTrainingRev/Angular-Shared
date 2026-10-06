import { Pipe, PipeTransform } from '@angular/core';

/**
 * join is a PURE custom PIPE: it joins an array into a comma-separated string.
 * It is pure by default, so it only re-runs when the input value's reference
 * changes. That means it misses in-place mutations to the array — which is
 * exactly the contrast shown in the pure vs impure demo.
 */
@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  // PipeTransform requires a transform method: it receives the value piped in
  // and returns the transformed value that the template displays.
  transform(value: unknown[]): string {
    return value.join(', ');
  }
}
