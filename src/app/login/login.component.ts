import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any; // Variable to store user data

  constructor(private router: Router, private authService: AuthService) {}

  googleSignIn() {
    this.authService.googleSignIn()
      .then((result) => {
        this.user = result.user;
        console.log(this.user);
        // Check if the user is already registered
        if (this.user) {
          // Redirect to the main page and pass user data
          this.router.navigate(['/'], { state: { userEmail: this.user.email, userPfp: this.user.photoURL } });
        } else {
          // User is not registered, navigate to the registration page
          this.router.navigate(['/Register']);
        }
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
        // Handle error, show a user-friendly message, or redirect to an error page
      });
  }

  navigateToSignIn() {
    this.router.navigate(['/Login/SignIn']);
  }
}