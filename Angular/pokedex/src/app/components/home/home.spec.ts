import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import {
  createMockPokeService,
  emptyPokemon,
  MockPokeService,
  pokemonFixture
} from '../../test/pokemon-fixture';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();
    // Start with no pokemon selected so the "not present" state is testable.
    mockPokeService.subject.next(emptyPokemon);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no pokemon present', () => {
    expect(component.pokemonPresent()).toBeFalse();
  });

  it('should not render the data components when no pokemon is present', () => {
    const dataComponents = fixture.nativeElement.querySelectorAll(
      'app-pokename, app-poke-sprites, app-poke-type, app-poke-moves'
    );
    expect(dataComponents.length).toBe(0);
  });

  it('should render the data components once a pokemon is present', () => {
    mockPokeService.subject.next(pokemonFixture);
    fixture.detectChanges();

    expect(component.pokemonPresent()).toBeTrue();

    const dataComponents = fixture.nativeElement.querySelectorAll(
      'app-pokename, app-poke-sprites, app-poke-type, app-poke-moves'
    );
    expect(dataComponents.length).toBe(4);
  });

  it('should update typesArray when colors are received', () => {
    component.onColorReceived(['red', 'blue']);
    expect(component.typesArray()).toEqual(['red', 'blue']);
  });
});
