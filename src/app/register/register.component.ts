import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //show password
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(inputType: string) {
    if (inputType === 'password') {
      this.showPassword = !this.showPassword;
    } else if (inputType === 'confirm_password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  ////////////////////////////////////////////////////
}