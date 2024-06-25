import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  email: string = '';
  password: string = '';

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  login_form: FormGroup = new FormGroup({});

  constructor(public router: Router, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  ngOnInit() {
    this.login_form = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
    });
  }

  checkLogin() {
    const activeMember = this.channelFirestore.members.find(obj => obj.email === this.login_form.value.email && obj.password === this.login_form.value.password);

    signInWithEmailAndPassword(this.auth, this.login_form.value.email, this.login_form.value.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.globalVariables.signed_in_member = user;
        console.log(this.globalVariables.signed_in_member)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    if (activeMember && this.login_form.valid) {
      this.router.navigate(['']);
    }
  }
}
