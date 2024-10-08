import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

  guestMember: Member = {
    member: 'Gast',
    email: 'guest@guestaccount.com',
    password: 'guestlogin12dabubble78&',
    avatar: './assets/img/channels/profile.svg'
  }

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
    await this.signInWithEmail(this.guestMember.email, this.guestMember.password);
    this.router.navigate(['']);
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
        const newMember: Member = {
          member: user.displayName || '',
          email: user.email || '',
          password: '',
          avatar: user.photoURL || ''
        }

        const emailAlreadyUsed = this.channelFirestore.members.filter(userEmail => userEmail.email === user.email);
        if (emailAlreadyUsed.length == 0) {
          this.channelFirestore.addMember(newMember);
        }
      }).catch((error) => {
        console.error(error)
      });

    this.router.navigate(['']);
  }
}
