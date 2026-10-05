import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleHome } from './example-home';

describe('ExampleHome', () => {
  let component: ExampleHome;
  let fixture: ComponentFixture<ExampleHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
