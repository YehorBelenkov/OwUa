import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Add this line

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { FinishedComponent } from './finished/finished.component';
import { CreatenewpasswordComponent } from './createnewpassword/createnewpassword.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthService } from './auth.service';
import { MostLikedComponent } from './most-liked/most-liked.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    SignInComponent,
    ForgotpasswordComponent,
    FinishedComponent,
    CreatenewpasswordComponent,
    MainPageComponent,
    MostLikedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // Add this line
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }