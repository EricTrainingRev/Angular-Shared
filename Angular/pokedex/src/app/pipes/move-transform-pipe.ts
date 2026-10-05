import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a hyphenated move name (e.g., "solar-beam") into a
 * human-readable format with capitalized words (e.g., "Solar Beam").
 * 
 * Useful for displaying Pokémon move names in a cleaner format.
 */
@Pipe({
  name: 'moveTransform'
})
export class MoveTransformPipe implements PipeTransform {

  /**
   * Splits the input string by hyphens, capitalizes the first letter of each word,
   * and joins them with spaces.
   * 
   * @param value - The original move name string (e.g., "solar-beam")
   * @param args - Optional additional arguments (not used here)
   * @returns A formatted string with capitalized words (e.g., "Solar Beam")
   */
  transform(value: string, ...args: unknown[]): string {
    const words = value.split('-');

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const firstLetter = word.charAt(0);
      const updatedWord = word.replace(firstLetter, firstLetter.toUpperCase());
      words[i] = updatedWord;
    }

    return words.join(' ');
  }
}
