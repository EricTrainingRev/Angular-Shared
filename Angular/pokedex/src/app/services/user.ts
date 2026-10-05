import { Injectable } from '@angular/core';

/**
 * User service that provides basic mock authentication functionality.
 * This is intended for learning purposes and does not represent secure authentication.
 */
@Injectable({
  providedIn: 'root' // Makes this service available application-wide without needing to register it in a module.
})
export class User {

  // Hardcoded credentials for demonstration purposes.
  validCredentials = {
    username: 'dev',
    password: 'dev'
  }

  /**
   * Attempts to log in a user by comparing input credentials to the hardcoded ones.
   * If successful, sets a flag in sessionStorage to indicate authentication.
   * 
   * @param username - The username entered by the user.
   * @param password - The password entered by the user.
   * @returns boolean - True if credentials match, false otherwise.
   */
  login(username: string, password: string): boolean {
    const usernameValid = username === this.validCredentials.username;
    const passwordValid = password === this.validCredentials.password;

    // Both username and password must be valid to authenticate.
    const isAuthenticated = usernameValid && passwordValid;

    // Store authentication status in sessionStorage if login is successful.
    if (isAuthenticated) {
      sessionStorage.setItem('authenticated', 'true');
    }

    return isAuthenticated;
  }

  /**
   * Checks if the user is currently logged in by reading sessionStorage.
   * 
   * @returns boolean - True if the user is authenticated, false otherwise.
   */
  isLoggedIn(): boolean {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    return isAuthenticated === 'true';
  }
}
