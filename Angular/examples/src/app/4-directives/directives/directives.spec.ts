import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Directives } from './directives';

describe('Directives', () => {
  let component: Directives;
  let fixture: ComponentFixture<Directives>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Directives],
    }).compileComponents();

    fixture = TestBed.createComponent(Directives);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
