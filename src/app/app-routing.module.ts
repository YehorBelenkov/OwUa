// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { CreatenewpasswordComponent } from './createnewpassword/createnewpassword.component';
import { FinishedComponent } from './finished/finished.component';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { VideoComponent } from './video/video.component';
import { MostLikedComponent } from './most-liked/most-liked.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { CommentsComponent } from './comments/comments.component';
import { GetvideoComponent } from './getvideo/getvideo.component';
import { WatchedvideoComponent } from './watchedvideo/watchedvideo.component';

const routes: Routes = [
  { path: 'Main', component: MainPageComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'forgot-password/create-new-password', component: CreatenewpasswordComponent },
  { path: 'forgot-password/sent', component: FinishedComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Login/SignIn', component: SignInComponent },
  { path: 'Liked', component: MostLikedComponent },
  { path: 'Upload', component: UploadVideoComponent },
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'video/:id', component: VideoComponent },
  { path: 'comment', component: CommentsComponent },
  { path: 'getvideo', component: GetvideoComponent },
  { path: 'watched', component: WatchedvideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }