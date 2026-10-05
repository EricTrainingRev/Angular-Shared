import { TestBed } from '@angular/core/testing';

import { User } from './user';

describe('User', () => {
  let service: User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(User);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true and set the session flag for valid credentials', () => {
    const result = service.login('dev', 'dev');
    expect(result).toBeTrue();
    expect(sessionStorage.getItem('authenticated')).toBe('true');
  });

  it('should return false and not set the session flag for invalid credentials', () => {
    const result = service.login('wrong', 'wrong');
    expect(result).toBeFalse();
    expect(sessionStorage.getItem('authenticated')).toBeNull();
  });

  it('should return false when only the username is wrong', () => {
    expect(service.login('wrong', 'dev')).toBeFalse();
  });

  it('should return false when only the password is wrong', () => {
    expect(service.login('dev', 'wrong')).toBeFalse();
  });

  it('should report logged in when the session flag is set', () => {
    sessionStorage.setItem('authenticated', 'true');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should report not logged in when the session flag is absent', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
