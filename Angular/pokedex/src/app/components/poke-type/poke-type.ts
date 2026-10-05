import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { PokeService } from '../../services/pokeservice';
import { Type } from '../../directives/type';
import { TitleCasePipe } from '@angular/common';
import { PokeSubscriber } from '../../utils/poke-subscriber';
import type { TypesObject } from '../../interfaces/pokemon';

/**
 * Displays the types of the selected Pokémon and emits their computed text colors.
 * Uses the custom `Type` directive to style each type label and reads the rendered
 * styles to pass color information to parent components.
 */
@Component({
  selector: 'app-poke-type',
  imports: [Type, TitleCasePipe],
  templateUrl: './poke-type.html',
  styleUrl: './poke-type.css'
})
export class PokeType extends PokeSubscriber implements AfterViewChecked {

  /**
   * Holds the current list of Pokémon types.
   * Initialized from cached data and updated via subscription.
   */
  pokeTypes: TypesObject[];

  /**
   * References to the rendered DOM elements for each type.
   * Used to extract computed styles after view updates.
   */
  @ViewChildren('typeItem')
  typeItems!: QueryList<ElementRef>;

  /**
   * Emits the computed text colors of each type element.
   * Allows parent components to use these colors for styling.
   */
  @Output()
  colorReceived = new EventEmitter<string[]>();

  constructor(private pokeService: PokeService) {
    super();

    const defaultTypes = this.pokeService.getCachedPokemon().types;
    this.pokeTypes = defaultTypes;

    this.subscription = this.pokeService.getPokemonData().subscribe(data => {
      this.pokeTypes = data.types;
    });
  }

  /**
   * Called after the view has been checked.
   * Extracts the computed text color from each type element and emits it.
   * Note: This approach is not the most performant but ensures consistency.
   */
  ngAfterViewChecked(): void {
    const colors: string[] = this.typeItems.map(item => {
      const element = item.nativeElement;
      return getComputedStyle(element).color;
    });

    this.colorReceived.emit(colors);
  }
}
