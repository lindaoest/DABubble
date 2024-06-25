import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  email: string = '';

  password_form: FormGroup = new FormGroup({});

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  constructor(public router: Router) {}

  ngOnInit() {
    this.password_form = new FormGroup({
      email: new FormControl('', Validators.email)
    });
  }

  sendEmail() {
    if (this.password_form.valid) {
      sendPasswordResetEmail(this.auth, this.password_form.value.email)
        .then(() => {
          // this.router.navigate(['new-password']);
          console.log('passwort reseted', this.auth)
          console.log('passwort reseted 2', this.password_form.value.email)

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  }
}
