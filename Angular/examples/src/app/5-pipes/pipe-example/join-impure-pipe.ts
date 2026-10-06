import { Pipe, PipeTransform } from '@angular/core';

/**
 * joinImpure is an IMPURE custom PIPE: it joins an array into a comma-separated
 * string, just like the pure join pipe. It is marked pure: false, so it re-runs
 * on every change-detection cycle rather than only when the input reference
 * changes. This lets it pick up in-place mutations to the array that the pure
 * join pipe misses.
 */
@Pipe({
  name: 'joinImpure',
  pure: false,
})
export class JoinImpurePipe implements PipeTransform {
  // PipeTransform requires a transform method: it receives the value piped in
  // and returns the transformed value that the template displays.
  transform(value: unknown[]): string {
    return value.join(', ');
  }
}
