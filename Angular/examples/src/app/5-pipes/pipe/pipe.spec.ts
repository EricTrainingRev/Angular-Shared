import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pipe } from './pipe';

describe('Pipe', () => {
  let component: Pipe;
  let fixture: ComponentFixture<Pipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pipe],
    }).compileComponents();

    fixture = TestBed.createComponent(Pipe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
