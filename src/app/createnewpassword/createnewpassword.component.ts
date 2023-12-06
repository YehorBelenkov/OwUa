import { Component } from '@angular/core';

@Component({
  selector: 'app-createnewpassword',
  templateUrl: './createnewpassword.component.html',
  styleUrls: ['./createnewpassword.component.css']
})
export class CreatenewpasswordComponent {
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
