import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDI } from './services-di';

describe('ServicesDI', () => {
  let component: ServicesDI;
  let fixture: ComponentFixture<ServicesDI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDI],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesDI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
