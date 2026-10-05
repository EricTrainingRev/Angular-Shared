import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Componenttwo } from './componenttwo';

describe('Componenttwo', () => {
  let component: Componenttwo;
  let fixture: ComponentFixture<Componenttwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Componenttwo],
    }).compileComponents();

    fixture = TestBed.createComponent(Componenttwo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
