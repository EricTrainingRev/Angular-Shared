import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import { createMockPokeService, MockPokeService } from '../../test/pokemon-fixture';
import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();

    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty search value', () => {
    expect(component.searchValue).toBe('');
  });

  it('should call searchPokemon on the service with the current search value', () => {
    component.searchValue = 'pikachu';
    component.searchForPokemon();
    expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('should call searchPokemon when the search button is clicked', () => {
    const input = fixture.nativeElement.querySelector('input.pokedex-search-input') as HTMLInputElement;
    const button = fixture.nativeElement.querySelector('button.pokedex-search-button') as HTMLButtonElement;

    input.value = 'charizard';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    button.click();
    expect(mockPokeService.searchPokemon).toHaveBeenCalledWith('charizard');
  });
});
