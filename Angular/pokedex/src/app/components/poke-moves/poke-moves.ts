import { Component, signal, WritableSignal } from '@angular/core';
import { PokeService } from '../../services/pokeservice';
import { MoveTransformPipe } from '../../pipes/move-transform-pipe';
import { PokeSubscriber } from '../../utils/poke-subscriber';
import type { MovesObject } from '../../interfaces/pokemon';

/**
 * Displays a list of moves for the selected Pokémon.
 * Subscribes to Pokémon data from the PokeService and updates the move list reactively.
 * Uses the MoveTransformPipe to format move names for display.
 */
@Component({
  selector: 'app-poke-moves',
  imports: [MoveTransformPipe],
  templateUrl: './poke-moves.html',
  styleUrl: './poke-moves.css'
})
export class PokeMoves extends PokeSubscriber {

  /**
   * Signal holding the current list of Pokémon moves.
   * Initialized from cached data and updated on new Pokémon selection.
   */
  pokemonMoves: WritableSignal<MovesObject[]>;

  constructor(private pokeService: PokeService) {
    super();

    this.pokemonMoves = signal(pokeService.getCachedPokemon().moves);

    this.subscription = pokeService.getPokemonData().subscribe(data => {
      this.pokemonMoves.set(data.moves);
    });
  }
}
