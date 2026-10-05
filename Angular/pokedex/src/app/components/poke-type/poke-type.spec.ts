import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import { createMockPokeService, MockPokeService, pokemonFixture, pokemonFixture2 } from '../../test/pokemon-fixture';
import { PokeType } from './poke-type';

describe('PokeType', () => {
  let component: PokeType;
  let fixture: ComponentFixture<PokeType>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();

    await TestBed.configureTestingModule({
      imports: [PokeType],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PokeType);
    component = fixture.componentInstance;
    spyOn(component.colorReceived, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize types from the cached pokemon', () => {
    expect(component.pokeTypes).toEqual(pokemonFixture.types);
  });

  it('should render each type label titlecased', () => {
    const items = fixture.nativeElement.querySelectorAll('p.type-item');
    expect(items.length).toBe(pokemonFixture.types.length);
    expect((items[0] as HTMLElement).textContent?.trim()).toBe('Electric');
  });

  it('should emit a color for each type after the view is checked', () => {
    expect(component.colorReceived.emit).toHaveBeenCalled();
    const emitted = (component.colorReceived.emit as jasmine.Spy).calls.mostRecent().args[0] as string[];
    expect(Array.isArray(emitted)).toBeTrue();
    expect(emitted.length).toBe(pokemonFixture.types.length);
  });

  it('should update the types when new pokemon data is pushed', () => {
    mockPokeService.subject.next(pokemonFixture2);
    fixture.detectChanges();

    expect(component.pokeTypes).toEqual(pokemonFixture2.types);

    const items = fixture.nativeElement.querySelectorAll('p.type-item');
    expect(items.length).toBe(pokemonFixture2.types.length);
    expect((items[0] as HTMLElement).textContent?.trim()).toBe('Fire');
    expect((items[1] as HTMLElement).textContent?.trim()).toBe('Flying');
  });
});
