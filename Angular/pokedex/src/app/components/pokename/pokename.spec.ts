import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import { createMockPokeService, emptyPokemon, MockPokeService, pokemonFixture } from '../../test/pokemon-fixture';
import { Pokename } from './pokename';

describe('Pokename', () => {
  let component: Pokename;
  let fixture: ComponentFixture<Pokename>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();
    // Start with no pokemon selected so the empty-name state is testable.
    mockPokeService.subject.next(emptyPokemon);

    await TestBed.configureTestingModule({
      imports: [Pokename],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(Pokename);
    component = fixture.componentInstance;
    component.typesArray = signal<string[]>([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty pokemon name', () => {
    expect(component.pokemonName()).toBe('');
  });

  it('should not render the name when it is empty', () => {
    const h2 = fixture.nativeElement.querySelector('h2.pokemon-name');
    expect(h2).toBeNull();
  });

  it('should update the name from the service and render it titlecased', () => {
    mockPokeService.subject.next(pokemonFixture);
    fixture.detectChanges();

    expect(component.pokemonName()).toBe('pikachu');
    const h2 = fixture.nativeElement.querySelector('h2.pokemon-name') as HTMLElement;
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe('Pikachu');
  });

  it('should derive the name color and shadow from the types array', () => {
    component.typesArray.set(['fire', 'water']);
    fixture.detectChanges();

    expect(component.nameColor()).toBe('fire');
    expect(component.nameShadow()).toBe('2px 2px water, 0 0 10px water');
  });

  it('should fall back to black color and shadow when there are no types', () => {
    component.typesArray.set([]);
    fixture.detectChanges();

    expect(component.nameColor()).toBe('black');
    expect(component.nameShadow()).toBe('2px 2px black, 0 0 10px black');
  });
});
