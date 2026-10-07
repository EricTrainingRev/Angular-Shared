import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncHTTP } from './async-http';

describe('AsyncHTTP', () => {
  let component: AsyncHTTP;
  let fixture: ComponentFixture<AsyncHTTP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncHTTP],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncHTTP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
