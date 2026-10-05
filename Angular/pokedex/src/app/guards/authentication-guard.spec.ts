import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { User } from '../services/user';
import { authenticationGuard } from './authentication-guard';

describe('authenticationGuard', () => {
  let userSpy: jasmine.SpyObj<User>;
  let routerSpy: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authenticationGuard(...guardParameters));

  beforeEach(() => {
    userSpy = jasmine.createSpyObj<User>('User', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: User, useValue: userSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation when the user is logged in', () => {
    userSpy.isLoggedIn.and.returnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to login when the user is not logged in', () => {
    userSpy.isLoggedIn.and.returnValue(false);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
