import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { MostLikedComponent } from './most-liked/most-liked.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { CommentsComponent } from './comments/comments.component';
import { GetvideoComponent } from './getvideo/getvideo.component';
import { WatchedvideoComponent } from './watchedvideo/watchedvideo.component';
import { VideoComponent } from './video/video.component';
import { ChanelComponent } from './chanel/chanel.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscribedComponent } from './subscribed/subscribed.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import { SafePipe } from './safe.pipe';
import { VideoPipe } from './video.pipe';
import { AuthService } from './auth.service';

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
    MostLikedComponent,
    UploadVideoComponent,
    CommentsComponent,
    GetvideoComponent,
    VideoComponent,
    ChanelComponent,
    SubscriptionsComponent,
    SubscribedComponent,
    SafePipe,
    VideoPipe,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    CommonModule,
    MatSelectModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), 
    AngularFireAuthModule, 
    AngularFireStorageModule, 
    AngularFirestoreModule,
    AngularFireDatabaseModule 
  ],
  providers: [AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }