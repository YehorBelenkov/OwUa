import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private location: Location) {}

  //Go back to the previous page
  goBack() {
    this.location.back();
  }
  //////////////////////////////

  //make the password visible
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  //////////////////////////////

}
