import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  email: string = '';

  password_form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.password_form = new FormGroup({
      email: new FormControl('', Validators.email)
    });
  }

  sendEmail() {
    if (this.password_form.valid) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.password_form.value.email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  }
}
