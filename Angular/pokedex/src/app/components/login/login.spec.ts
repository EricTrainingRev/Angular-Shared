import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on successful login', async () => {
    component.usernameInput = 'dev';
    component.passwordInput = 'dev';

    await component.attemptLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    expect(component.errorMessage).toBe('');
  });

  it('should set an error message and not navigate on failed login', async () => {
    component.usernameInput = 'wrong';
    component.passwordInput = 'wrong';

    await component.attemptLogin();

    expect(component.errorMessage).toBe('login failed, please try again');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
