import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';

/**
 * Applies a text color to the host element based on the Pokémon type
 * provided via the `appType` attribute. Uses Angular's Renderer2 for safe
 * DOM manipulation and listens for input changes to update the style dynamically.
 * 
 * Example usage in a template:
 *   <li [appType]="'fire'">Fire</li>
 * 
 * If the type is not recognized, the text color defaults to black.
 */
@Directive({
  selector: '[appType]' // Attribute selector for applying the directive
})
export class Type implements OnChanges {

  /**
   * Receives the Pokémon type string from the template.
   * Bound to the `appType` attribute.
   * Example values: "fire", "water", "grass", etc.
   */
  @Input('appType') type: string = '';

  /**
   * A mapping of Pokémon types to their associated hex color codes.
   * These colors are inspired by official Pokémon media and games.
   */
  pokemonTypeColors: Record<string, string> = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water": "#6390F0",
    "electric": "#F7D02C",
    "grass": "#7AC74C",
    "ice": "#96D9D6",
    "fighting": "#C22E28",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "flying": "#A98FF3",
    "psychic": "#F95587",
    "bug": "#A6B91A",
    "rock": "#B6A136",
    "ghost": "#735797",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "steel": "#B7B7CE",
    "fairy": "#D685AD"
  };

  /**
   * @param element - Reference to the host DOM element
   * @param renderer - Angular's Renderer2 for safe DOM manipulation
   */
  constructor(private element: ElementRef, private renderer: Renderer2) {}

  /**
   * Called whenever the `type` input changes.
   * Applies the corresponding color to the host element's text.
   * Defaults to black if the type is not recognized.
   * 
   * @param changes - Object containing the changed input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      // Normalize the input to lowercase and trim whitespace
      const typeKey = this.type.trim().toLowerCase();

      // Get the corresponding color or fallback to black
      const color = this.pokemonTypeColors[typeKey] || '#000000';

      // Apply the color to the host element's text
      this.renderer.setStyle(this.element.nativeElement, 'color', color);
    }
  }
}
