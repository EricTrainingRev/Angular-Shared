import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Pokemon } from '../interfaces/pokemon';

/**
 * PokeService is responsible for fetching and caching Pokémon data
 * from the public PokéAPI. It exposes reactive streams for components
 * to subscribe to and also provides synchronous access to the cached data.
 * 
 * Only the relevant fields defined in the `Pokemon` interface are extracted
 * from the API response to ensure type safety and clean data handling.
 */
@Injectable({
  providedIn: 'root'
})
export class PokeService {

  /**
   * Internal BehaviorSubject that holds the current Pokémon data.
   * BehaviorSubject is used so that subscribers always receive the latest value immediately.
   */
  private pokemonSubject: BehaviorSubject<Pokemon>;

  /**
   * Initializes the service with a default empty Pokémon object.
   * This ensures that subscribers have a valid initial value and prevents null references.
   * 
   * @param httpClient Angular's HttpClient for making API requests.
   */
  constructor(private httpClient: HttpClient) {
    this.pokemonSubject = new BehaviorSubject<Pokemon>({
      name: '',
      sprites: {
        back_default: '',
        back_shiny: '',
        front_default: '',
        front_shiny: ''
      },
      types: [],
      moves: []
    });
  }

  /**
   * Fetches Pokémon data from the PokéAPI using the given identifier (name or ID).
   * The response is filtered to include only the fields defined in the `Pokemon` interface.
   * The filtered data is then cached and emitted to subscribers.
   * 
   * @param identifier The name or ID of the Pokémon to fetch.
   */
  searchPokemon(identifier: string): void {
    this.httpClient.get<any>(`https://pokeapi.co/api/v2/pokemon/${identifier}`)
      .subscribe({
        next: (rawData) => {
          // Transform raw API response into a strongly typed Pokémon object
          const filteredData = this.mapToPokemon(rawData);
          // Emit the new Pokémon data to all subscribers
          this.pokemonSubject.next(filteredData);
        },
        error: (err) => {
          // Log any errors that occur during the HTTP request
          console.error("Error fetching Pokémon data:", err);
        }
      });
  }

  /**
   * Returns the current cached Pokémon data synchronously.
   * Useful for components that need immediate access to the latest value
   * without subscribing to the observable.
   * 
   * @returns The current Pokémon object stored in the BehaviorSubject.
   */
  getCachedPokemon(): Pokemon {
    return this.pokemonSubject.getValue();
  }

  /**
   * Returns an observable stream of Pokémon data.
   * Components can subscribe to this to reactively receive updates
   * whenever the Pokémon data changes.
   * 
   * @returns Observable that emits Pokémon data whenever it changes.
   */
  getPokemonData(): Observable<Pokemon> {
    return this.pokemonSubject.asObservable();
  }

  /**
   * Maps the raw API response to a strongly typed `Pokemon` object.
   * Only the fields defined in the `Pokemon` interface are included.
   * This helps maintain clean and predictable data structures.
   * 
   * @param rawData The raw response from the PokéAPI.
   * @returns A filtered and typed `Pokemon` object.
   */
  private mapToPokemon(rawData: any): Pokemon {
    return {
      name: rawData.name,
      sprites: {
        back_default: rawData.sprites.back_default,
        back_shiny: rawData.sprites.back_shiny,
        front_default: rawData.sprites.front_default,
        front_shiny: rawData.sprites.front_shiny
      },
      types: rawData.types.map((t: any) => ({
        slot: t.slot,
        type: {
          name: t.type.name,
          url: t.type.url
        }
      })),
      moves: rawData.moves.map((m: any) => ({
        move: {
          name: m.move.name
        }
      }))
    };
  }

}
