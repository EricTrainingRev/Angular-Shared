import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Routing } from './routing';

describe('Routing', () => {
  let component: Routing;
  let fixture: ComponentFixture<Routing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Routing],
    }).compileComponents();

    fixture = TestBed.createComponent(Routing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
