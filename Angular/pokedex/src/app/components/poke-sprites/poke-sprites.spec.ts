import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeService } from '../../services/pokeservice';
import { createMockPokeService, MockPokeService, pokemonFixture, pokemonFixture2 } from '../../test/pokemon-fixture';
import { PokeSprites } from './poke-sprites';

describe('PokeSprites', () => {
  let component: PokeSprites;
  let fixture: ComponentFixture<PokeSprites>;
  let mockPokeService: MockPokeService;

  beforeEach(async () => {
    mockPokeService = createMockPokeService();

    await TestBed.configureTestingModule({
      imports: [PokeSprites],
      providers: [{ provide: PokeService, useValue: mockPokeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PokeSprites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sprites from the cached pokemon', () => {
    expect(component.pokeSprites()).toEqual(pokemonFixture.sprites);
  });

  it('should return the sprite URLs from getSpriteSources', () => {
    expect(component.getSpriteSources()).toEqual(Object.values(pokemonFixture.sprites));
  });

  it('should render one image per sprite with the correct src and alt', () => {
    const imgs = fixture.nativeElement.querySelectorAll('img.sprite-img');
    expect(imgs.length).toBe(4);

    const expected = Object.values(pokemonFixture.sprites);
    imgs.forEach((img: HTMLImageElement, i: number) => {
      expect(img.src).toBe(expected[i]);
      expect(img.alt).toBe(`sprite-${i}`);
    });
  });

  it('should update the sprites when new pokemon data is pushed', () => {
    mockPokeService.subject.next(pokemonFixture2);
    fixture.detectChanges();

    expect(component.pokeSprites()).toEqual(pokemonFixture2.sprites);

    const imgs = fixture.nativeElement.querySelectorAll('img.sprite-img');
    expect(imgs.length).toBe(4);
    expect((imgs[0] as HTMLImageElement).src).toBe(pokemonFixture2.sprites.back_default);
    expect((imgs[3] as HTMLImageElement).src).toBe(pokemonFixture2.sprites.front_shiny);
  });
});
