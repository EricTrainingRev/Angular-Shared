import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { customGuardGuard } from './custom-guard-guard';

describe('customGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => customGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
