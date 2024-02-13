import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth.service';

import { LoginResponse } from '../interfaces/auth-response.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any; // Variable to store user data

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  googleSignIn() {
    this.authService.googleSignIn()
      .then((result) => {
        this.user = result.user;
        console.log(this.user);
  
        // Prepare data for the API request
        const requestData = {
          uid: this.user.uid,
          email: this.user.email,
          emailVerified: this.user.emailVerified,
          displayName: this.user.displayName,
          photoUrl: this.user.photoURL
        };
        // Make the API request to http://localhost:8085/api/google/login
        this.http.post<LoginResponse>('http://nikstep.com.ua:8085/api/google/login', requestData)
          .subscribe(response => {
            // Store the access token and user data in localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));
  
            // Set the refreshToken in the cookie
            this.setCookie('refreshToken', response.refreshToken, 365);
  
            console.log(response);
            // Redirect to the main page
            this.router.navigate(['/']);
          }, error => {
            console.error('Error during Google login API request:', error);
            // Handle error, show a user-friendly message, or redirect to an error page
          });
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
        // Handle error, show a user-friendly message, or redirect to an error page
      });
  }

  // Function to set an HttpOnly cookie
  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
  
    // Set the cookie
    document.cookie = `${name}=${value}; ${expires}; path=/;`;
  
    // Check if the cookie was created
    const cookieExists = document.cookie.indexOf(name + "=" + value) !== -1;
    if (cookieExists) {
      console.log(`Cookie '${name}' was created.`);
    } else {
      console.error(`Error creating cookie '${name}'.`);
    }
  }
  navigateToSignIn() {
    this.router.navigate(['/Login/SignIn']);
  }
}