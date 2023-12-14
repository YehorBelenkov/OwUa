import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCN-BiE-4qZz4G2qTfGuMJ_uYSYwjkyRqQ",
    authDomain: "login-c47f8.firebaseapp.com",
    projectId: "login-c47f8",
    storageBucket: "login-c47f8.appspot.com",
    messagingSenderId: "494533076058",
    appId: "1:494533076058:web:bf1ac0a8a113b1f4972463",
    measurementId: "G-4XZR8J76M4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
}