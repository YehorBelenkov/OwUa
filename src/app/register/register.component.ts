// Import necessary modules
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // User input variables
  userName: string = '';
  userEmail: string = '';
  password: string = '';

  // Show password
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility(inputType: string) {
    if (inputType === 'password') {
      this.showPassword = !this.showPassword;
    }
  }

  register() {
    // Prepare data from user input
    const data = {
      userName: this.userName,
      userEmail: this.userEmail,
      password: this.password,
    };
    
    // Make the POST request
    this.http.post('http://localhost:8085/api/auth/register', data).subscribe(
      (response) => {
        // Handle the response if needed
        console.log('Registration successful:', response);

        // Navigate to the login page upon successful registration
        this.router.navigate(['/Login/SignIn']); // Adjust the route
      },
      (error) => {
        // Handle errors
        console.error('Registration failed:', error);
        console.log(data);
      }
    );
  }
}