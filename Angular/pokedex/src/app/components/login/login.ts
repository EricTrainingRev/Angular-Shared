import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/user';
import { FormsModule } from '@angular/forms';

/**
 * Handles user login functionality.
 * Binds input fields for username and password, and attempts authentication
 * using the User service. Navigates to the home page on success, or displays
 * an error message on failure.
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usernameInput = '';
  passwordInput = '';
  errorMessage = '';

  constructor(private router: Router, private userService: User) {}

  /**
   * Attempts to log in using the provided credentials.
   * Navigates to the home page if successful, otherwise sets an error message.
   */
  async attemptLogin() {
    const loginSuccessful = this.userService.login(this.usernameInput, this.passwordInput);
    if (loginSuccessful) {
      await this.router.navigate(['home']);
    } else {
      this.errorMessage = 'login failed, please try again';
    }
  }
}
