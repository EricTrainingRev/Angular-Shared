import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShorthandExample } from './shorthand-example';

describe('ShorthandExample', () => {
  let component: ShorthandExample;
  let fixture: ComponentFixture<ShorthandExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShorthandExample],
    }).compileComponents();

    fixture = TestBed.createComponent(ShorthandExample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
