import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emulated } from './emulated';

describe('Emulated', () => {
  let component: Emulated;
  let fixture: ComponentFixture<Emulated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emulated],
    }).compileComponents();

    fixture = TestBed.createComponent(Emulated);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
