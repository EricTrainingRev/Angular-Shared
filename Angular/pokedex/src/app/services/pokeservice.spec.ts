import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Pokemon } from '../interfaces/pokemon';
import { pokemonFixture } from '../test/pokemon-fixture';
import { PokeService } from './pokeservice';

/**
 * A raw PokéAPI response shaped like what the real API returns, matching
 * the fields PokeService.mapToPokemon reads.
 */
const rawPikachu = {
  name: 'pikachu',
  sprites: {
    back_default: pokemonFixture.sprites.back_default,
    back_shiny: pokemonFixture.sprites.back_shiny,
    front_default: pokemonFixture.sprites.front_default,
    front_shiny: pokemonFixture.sprites.front_shiny
  },
  types: pokemonFixture.types,
  moves: pokemonFixture.moves
};

describe('PokeService', () => {
  let service: PokeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PokeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a pokemon from the correct URL', () => {
    service.searchPokemon('pikachu');

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(req.request.method).toBe('GET');
    req.flush(rawPikachu);
  });

  it('should map the raw response to the Pokemon shape and emit it', () => {
    let emitted: Pokemon | undefined;
    service.getPokemonData().subscribe((data) => (emitted = data));

    service.searchPokemon('pikachu');
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu').flush(rawPikachu);

    expect(emitted).toEqual(pokemonFixture);
  });

  it('should return the latest cached pokemon synchronously', () => {
    service.searchPokemon('pikachu');
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu').flush(rawPikachu);

    expect(service.getCachedPokemon()).toEqual(pokemonFixture);
  });
});
