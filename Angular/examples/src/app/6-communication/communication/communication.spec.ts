import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Communication } from './communication';

describe('Communication', () => {
  let component: Communication;
  let fixture: ComponentFixture<Communication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Communication],
    }).compileComponents();

    fixture = TestBed.createComponent(Communication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
