import { CanActivateFn } from '@angular/router';

export const customGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
