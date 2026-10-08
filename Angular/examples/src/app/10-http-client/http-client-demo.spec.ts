import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientDemo } from './http-client-demo';

describe('HttpClientDemo', () => {
  let component: HttpClientDemo;
  let fixture: ComponentFixture<HttpClientDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpClientDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
