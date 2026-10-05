import { Component, signal, WritableSignal } from '@angular/core';
import { Instructions } from "../instructions/instructions";
import { Search } from "../search/search";
import { PokeService } from '../../services/pokeservice';
import { Pokename } from "../pokename/pokename";
import { PokeType } from '../poke-type/poke-type';
import { PokeSprites } from "../poke-sprites/poke-sprites";
import { PokeMoves } from '../poke-moves/poke-moves';
import { PokeSubscriber } from '../../utils/poke-subscriber';

/**
 * Main container component for the Pokedex interface.
 * Coordinates the display of instructional text, search input, and Pokémon data components.
 * Reactively tracks whether a Pokémon is present and passes type colors to child components.
 */
@Component({
  selector: 'app-home',
  imports: [Instructions, Search, Pokename, PokeType, PokeSprites, PokeMoves],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home extends PokeSubscriber {

  /**
   * Signal indicating whether a Pokémon has been successfully loaded.
   * Used to conditionally render data components.
   */
  pokemonPresent = signal(false);

  /**
   * Signal holding the color values derived from the Pokémon's types.
   * Passed to child components for dynamic styling.
   */
  typesArray: WritableSignal<string[]> = signal([]);

  constructor(private pokeService: PokeService) {
    super();

    this.subscription = this.pokeService.getPokemonData().subscribe(data => {
      this.pokemonPresent.set(!!data.name);
      this.typesArray.set([]);
    });
  }

  /**
   * Receives color values emitted by the PokeType component.
   * Updates the typesArray signal for use in styling other components.
   */
  onColorReceived(colors: string[]) {
    this.typesArray.set(colors);
  }
}
