import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoScope } from './no-scope';

describe('NoScope', () => {
  let component: NoScope;
  let fixture: ComponentFixture<NoScope>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoScope],
    }).compileComponents();

    fixture = TestBed.createComponent(NoScope);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
