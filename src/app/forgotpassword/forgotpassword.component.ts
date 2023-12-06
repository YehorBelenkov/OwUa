import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  constructor(private location: Location) {}

  //Go back to the previous page
  goBack() {
    this.location.back();
  }
  //////////////////////////////
}
