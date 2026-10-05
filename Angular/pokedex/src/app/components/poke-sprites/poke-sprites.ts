import { Component, signal, WritableSignal } from '@angular/core';
import { PokeService } from '../../services/pokeservice';
import { PokeSubscriber } from '../../utils/poke-subscriber';
import type { SpritesObject } from '../../interfaces/pokemon';

/**
 * Displays all available sprite images for the selected Pokémon.
 * Subscribes to Pokémon data from the PokeService and updates the sprite list reactively.
 */
@Component({
  selector: 'app-poke-sprites',
  imports: [],
  templateUrl: './poke-sprites.html',
  styleUrl: './poke-sprites.css'
})
export class PokeSprites extends PokeSubscriber {

  /**
   * Signal holding the current set of sprite image URLs.
   * Initialized from cached data and updated on new Pokémon selection.
   */
  pokeSprites: WritableSignal<SpritesObject>;

  constructor(private pokeService: PokeService) {
    super();

    const spritesRef = this.pokeService.getCachedPokemon().sprites;
    this.pokeSprites = signal(spritesRef);

    this.subscription = this.pokeService.getPokemonData().subscribe(data => {
      this.pokeSprites.set(data.sprites);
    });
  }

  /**
   * Converts the sprite object into an array of image URLs.
   * Used to render each sprite in the template.
   */
  getSpriteSources(): string[] {
    return Object.values(this.pokeSprites());
  }
}
