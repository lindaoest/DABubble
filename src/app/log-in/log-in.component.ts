import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';
import { Member } from '../../models/member.class';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  newMember: Member = {
    member: 'Gast',
    email: 'guest@guestaccount.com',
    password: 'guestlogin12dabubble78&',
    avatar: './assets/img/channels/profile.svg'
  }

  user_already_exits: Boolean = false;

  email: string = '';
  password: string = '';

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  provider = new GoogleAuthProvider();

  login_form: FormGroup = new FormGroup({});

  constructor(public router: Router, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  async ngOnInit() {
    this.login_form = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
    });


    if (!this.user_already_exits) {
      await createUserWithEmailAndPassword(this.auth, this.newMember.email, this.newMember.password)
        .then((userCredential) => {
          // Registriert
          const user = userCredential.user;

          this.user_already_exits = false;

          updateProfile(user, {
            displayName: this.newMember.member, photoURL: this.newMember.avatar
          }).then(() => {
            console.log('with name', user.displayName)
          }).catch((error) => {
            console.log(error);
          });

          console.log('Registrierung erfolgreich:', user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Fehler bei der Registrierung:', errorCode, errorMessage);
          this.user_already_exits = true;
        });
    }
  }

  async checkLogin() {
    const activeMember = this.channelFirestore.members.find(obj => obj.email === this.login_form.value.email && obj.password === this.login_form.value.password);

    await this.signInWithEmail(this.login_form.value.email, this.login_form.value.password);

    if (activeMember && this.login_form.valid) {
      this.router.navigate(['']);
    }
  }

  async signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.globalVariables.signed_in_member = user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  async guestLogin() {
    if (!this.user_already_exits) {
      this.user_already_exits = true;
      this.channelFirestore.addMember(this.newMember);
      await this.signInWithEmail(this.newMember.email, this.newMember.password);
      this.router.navigate(['']);
    }
  }

  googleAuth() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
        }
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log('user', user)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    this.router.navigate(['']);
  }
}
