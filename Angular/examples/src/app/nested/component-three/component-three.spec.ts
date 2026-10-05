import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentThree } from './component-three';

describe('ComponentThree', () => {
  let component: ComponentThree;
  let fixture: ComponentFixture<ComponentThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentThree],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentThree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
