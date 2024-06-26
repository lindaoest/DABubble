import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getAuth, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  password_form: FormGroup = new FormGroup({});

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  actionCode!: string;

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.password_form = new FormGroup({
      password: new FormControl('', Validators.required)
    });

    this.route.paramMap.subscribe((params) => {
      this.actionCode = params.get('oobCode')!;
    });
  }

  resetPassword() {
    if (this.password_form.valid) {
      const auth = getAuth();

      this.route.queryParams.subscribe(params => {
        const actionCode = params['oobCode'];
        const newPassword = this.password_form.value.password;

        console.log('actionCode', newPassword)

        confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {
          console.log('resp', resp);
          this.router.navigate(['log-in']);
        }).catch((error) => {
          console.log(error);
        });
      });

      confirmPasswordReset(auth, this.actionCode, this.password_form.value.password).then((resp) => {
        // Password reset has been confirmed and new password updated.

        console.log('resp', resp);
        this.router.navigate(['log-in']);
      }).catch((error) => {
        console.log(error)
      });
    }
  }
}
