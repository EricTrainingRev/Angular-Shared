import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentOne } from './component-one';

describe('ComponentOne', () => {
  let component: ComponentOne;
  let fixture: ComponentFixture<ComponentOne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentOne],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentOne);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
