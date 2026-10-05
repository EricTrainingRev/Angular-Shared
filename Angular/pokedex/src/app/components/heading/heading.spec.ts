import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Heading } from './heading';

describe('Heading', () => {
  let component: Heading;
  let fixture: ComponentFixture<Heading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heading]
    }).compileComponents();

    fixture = TestBed.createComponent(Heading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default the heading signal to the welcome message', () => {
    expect(component.heading()).toBe('Welcome to the Pokedex!');
  });

  it('should render the heading text in the h1', () => {
    const h1 = fixture.nativeElement.querySelector('h1.pokedex-header') as HTMLElement;
    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe('Welcome to the Pokedex!');
  });
});
