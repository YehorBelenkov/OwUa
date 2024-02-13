import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Importing interface
import { LoginResponse } from '../interfaces/auth-response.interface';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private http: HttpClient, private location: Location, private router: Router) {}

  // Go back to the previous page
  goBack() {
    this.location.back();
  }

  // Make the password visible
  showPassword = false;

  // Properties to bind to input fields
  email: string = '';
  password: string = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Handle login button click
  login() {
    const data = {
      email: this.email, // Use the actual input value
      password: this.password, // Use the actual input value
    };

    // Make the POST request
    this.http.post<LoginResponse>('http://nikstep.com.ua:8085/api/auth/auth', data)
      .subscribe(response => {
        // Store the access token and user data in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.setCookie('refreshToken', response.refreshToken, 365);

        // Redirect to the main page
        this.router.navigate(['/']);
      }, error => {
        console.error('Login failed:', error);
      });
  }

  // Function to set a cookie
  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
  
    document.cookie = `${name}=${value}; ${expires}; path=/;`;
  }
}