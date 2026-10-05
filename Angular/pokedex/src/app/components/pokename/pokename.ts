import {
  Component,
  computed,
  effect,
  Input,
  signal,
  WritableSignal
} from '@angular/core';
import { PokeService } from '../../services/pokeservice';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { PokeSubscriber } from '../../utils/poke-subscriber';

/**
 * Displays the name of the selected Pokémon with dynamic styling.
 * Subscribes to Pokémon data from the PokeService and updates the name,
 * text color, and shadow based on the Pokémon's types.
 * 
 * NOTE: a more efficient way to stylize the name would be to use the service to directly
 * access the type information. The current setup was done to showcase receiving data from
 * a parent resource
 */
@Component({
  selector: 'app-pokename',
  imports: [TitleCasePipe, NgStyle],
  templateUrl: './pokename.html',
  styleUrl: './pokename.css'
})
export class Pokename extends PokeSubscriber {

  /**
   * Holds the current Pokémon name as a reactive signal.
   * Updated via subscription to the PokeService.
   */
  pokemonName = signal("");

  /**
   * Input signal containing the Pokémon's types.
   * Used to determine the name's color and shadow styling.
   */
  @Input()
  typesArray!: WritableSignal<string[]>;

  /**
   * Signal for the text color of the Pokémon name.
   * Derived from the first type in the types array.
   */
  nameColor: WritableSignal<string> = signal('black');

  /**
   * Signal for the text shadow of the Pokémon name.
   * Derived from the second type in the types array.
   */
  nameShadow: WritableSignal<string> = signal('2px 2px black, 0 0 10px black');

  constructor(private pokeService: PokeService) {
    super();

    // Subscribe to Pokémon data and update the name signal
    this.subscription = this.pokeService.getPokemonData().subscribe(
      data => this.pokemonName.set(data.name)
    );

    // Reactively update color and shadow based on types
    effect(() => {
      const types = this.typesArray();
      const color = types.length > 0 ? types[0] : 'black';
      const shadowColor = types.length > 1 ? types[1] : 'black';
      this.nameColor.set(color);
      this.nameShadow.set(`2px 2px ${shadowColor}, 0 0 10px ${shadowColor}`);
    });
  }
}
