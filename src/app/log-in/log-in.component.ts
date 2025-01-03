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
import { UserStatusService } from '../shared/services/user-status/user-status.service';
import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { InputComponent } from '../form/input/input.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    AuthContainerComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  private firebaseConfig = privateConfig;
  private app = initializeApp(this.firebaseConfig);
  private auth = getAuth(this.app);
  private provider = new GoogleAuthProvider();

  public form: FormGroup = new FormGroup({});
  public email!: string;
  public password!: string;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
    public router: Router,
    public userStatusService: UserStatusService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
    });
  }

  public googleAuth() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const user = result.user;

        const newMember: Member = {
          member: user.displayName || '',
          email: user.email || '',
          password: '',
          avatar: user.photoURL || '',
          isOnline: false
        }

        const emailAlreadyUsed = this.firestoreService.members.find(userEmail => userEmail.email === user.email);
        if (!emailAlreadyUsed) {
          this.firestoreService.addMember(newMember);
          this.router.navigate(['']);
        }
      }).catch((error) => {
        console.error(error)
      });
  }

  public async login() {
    const activeMember = this.firestoreService.members.find(obj => obj.email === this.form.value.email && obj.password === this.form.value.password);

    await this.signInWithEmail(this.form.value.email, this.form.value.password);

    if (activeMember && this.form.valid) {
      this.router.navigate(['']);
    }
  }

  public async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      this.globalVariables.signed_in_member = user;

      // Observe online-/offline-status
      this.userStatusService.initialize(userId);

    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  async guestLogin() {
    let email = 'guest@guestaccount.com';
    let password = 'guestlogin12dabubble78&';

    await this.signInWithEmail(email, password);

    this.router.navigate(['']);
  }
}
