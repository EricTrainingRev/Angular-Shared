import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lifecycle } from './lifecycle';

describe('Lifecycle', () => {
  let component: Lifecycle;
  let fixture: ComponentFixture<Lifecycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lifecycle],
    }).compileComponents();

    fixture = TestBed.createComponent(Lifecycle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
