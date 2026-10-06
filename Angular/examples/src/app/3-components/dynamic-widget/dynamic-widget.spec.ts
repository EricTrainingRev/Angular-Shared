import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicWidget } from './dynamic-widget';

describe('DynamicWidget', () => {
  let component: DynamicWidget;
  let fixture: ComponentFixture<DynamicWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
