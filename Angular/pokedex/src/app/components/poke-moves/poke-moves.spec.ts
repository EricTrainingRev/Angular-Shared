import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import { createMockPokeService, MockPokeService, pokemonFixture, pokemonFixture2 } from '../../test/pokemon-fixture';
import { PokeMoves } from './poke-moves';

describe('PokeMoves', () => {
  let component: PokeMoves;
  let fixture: ComponentFixture<PokeMoves>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();

    await TestBed.configureTestingModule({
      imports: [PokeMoves],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PokeMoves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize moves from the cached pokemon', () => {
    expect(component.pokemonMoves()).toEqual(pokemonFixture.moves);
  });

  it('should render each move name transformed by the pipe', () => {
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(pokemonFixture.moves.length);

    const expected = ['Mega Punch', 'Pay Day', 'Thunder Punch'];
    items.forEach((li: HTMLElement, i: number) => {
      expect(li.textContent).toBe(expected[i]);
    });
  });

  it('should update the moves when new pokemon data is pushed', () => {
    mockPokeService.subject.next(pokemonFixture2);
    fixture.detectChanges();

    expect(component.pokemonMoves()).toEqual(pokemonFixture2.moves);

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(pokemonFixture2.moves.length);
    expect((items[0] as HTMLElement).textContent).toBe('Mega Punch');
  });
});
