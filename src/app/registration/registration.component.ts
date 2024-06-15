import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member.class';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  data: Member = {
    member: '',
    email: '',
    password: '',
    avatar: ''
  }

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  registration_form: FormGroup = new FormGroup({});

  constructor(public router: Router, private globalVariables: GlobalVariablesService) { }

  privacyChecked: boolean = false;
  disableButton: Boolean = true;

  ngOnInit() {
    this.registration_form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      privacyChecked: new FormControl('', Validators.required),
    });
  }

  onPrivacyChange() {
    this.privacyChecked = !this.privacyChecked;
  }

  checkFields() {
    this.disableButton = (
      !this.data.member ||
      !this.data.email ||
      !this.data.password ||
      !this.privacyChecked
    )
  }

  onSubmit() {
    if (this.registration_form.valid) {
      this.globalVariables.newMember.push(this.registration_form.value);
      this.router.navigate(['choose-avatar']);

      createUserWithEmailAndPassword(this.auth, this.registration_form.value.email, this.registration_form.value.password)
        .then((userCredential) => {
          // Registriert
          const user = userCredential.user;

          updateProfile(user, {
            displayName: this.registration_form.value.member, photoURL:this.registration_form.value.avatar
          }).then(() => {
            console.log('with name', user)
          }).catch((error) => {
            // An error occurred
            // ...
          });

          console.log('Registrierung erfolgreich:', user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Fehler bei der Registrierung:', errorCode, errorMessage);
        });
    }
  }
}
