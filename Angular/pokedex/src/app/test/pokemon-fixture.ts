import { BehaviorSubject, Observable } from 'rxjs';
import type { Pokemon } from '../interfaces/pokemon';

/**
 * A typed sample Pokémon used as the default data for component specs.
 * Contains a name, two types, four sprites, and two moves so every
 * data-driven component has something meaningful to render.
 */
export const pokemonFixture: Pokemon = {
  name: 'pikachu',
  sprites: {
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png',
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png'
  },
  types: [
    { slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }
  ],
  moves: [
    { move: { name: 'mega-punch' } },
    { move: { name: 'pay-day' } },
    { move: { name: 'thunder-punch' } }
  ]
};

/**
 * A second Pokémon used to verify that components react to new data
 * pushed through the mock service's subject.
 */
export const pokemonFixture2: Pokemon = {
  name: 'charizard',
  sprites: {
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/6.png',
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png'
  },
  types: [
    { slot: 1, type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' } },
    { slot: 2, type: { name: 'flying', url: 'https://pokeapi.co/api/v2/type/3/' } }
  ],
  moves: [
    { move: { name: 'mega-punch' } },
    { move: { name: 'fire-punch' } },
    { move: { name: 'thunder-punch' } }
  ]
};

/**
 * The empty Pokémon the real PokeService initializes with (name: '').
 * Used to test the "no pokemon selected yet" state of components.
 */
export const emptyPokemon: Pokemon = {
  name: '',
  sprites: {
    back_default: '',
    back_shiny: '',
    front_default: '',
    front_shiny: ''
  },
  types: [],
  moves: []
};

/**
 * A mock PokeService for component specs. Backed by a BehaviorSubject so
 * tests can push new Pokémon data and assert that components react.
 *
 * The returned object is structurally compatible with PokeService and can
 * be provided via `{ provide: PokeService, useValue: mock }`.
 */
export function createMockPokeService(): {
  subject: BehaviorSubject<Pokemon>;
  getPokemonData: () => Observable<Pokemon>;
  getCachedPokemon: () => Pokemon;
  searchPokemon: jasmine.Spy;
} {
  const subject = new BehaviorSubject<Pokemon>(pokemonFixture);

  return {
    subject,
    getPokemonData: () => subject.asObservable(),
    getCachedPokemon: () => subject.getValue(),
    searchPokemon: jasmine.createSpy('searchPokemon')
  };
}

export type MockPokeService = ReturnType<typeof createMockPokeService>;
