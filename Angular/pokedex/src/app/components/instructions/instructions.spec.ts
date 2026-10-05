import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instructions } from './instructions';

describe('Instructions', () => {
  let component: Instructions;
  let fixture: ComponentFixture<Instructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instructions]
    }).compileComponents();

    fixture = TestBed.createComponent(Instructions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default the instructions signal to the guidance message', () => {
    expect(component.instructions()).toBe('Enter the name of a Pokemon to look up its stats');
  });

  it('should render the instructions text in the paragraph', () => {
    const p = fixture.nativeElement.querySelector('p.pokedex-instructions') as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.textContent).toBe('Enter the name of a Pokemon to look up its stats');
  });
});
