import { Component } from '@angular/core';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { Member } from '../../models/member.class';
import { Router, RouterModule } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  profilePicture = "./assets/img/channels/profile.svg";
  file: File | null = null;
  chooseImage: boolean = true;
  url: string = '';
  successSignIn: Boolean = false;
  user_already_exists: Boolean = false;

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  constructor(public router: Router, public firestore: Firestore, public globalVariables: GlobalVariablesService, public firestoreService: FirestoreService) {
    console.log(this.globalVariables.newMember)
  }

  addImage(item: number) {
    this.profilePicture = `./assets/img/avatar/avatar-${item}.svg`;
    this.chooseImage = false;
  }

  async handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;

      const storage = getStorage();
      const starsRef = ref(storage, `images/${this.file.name}`);

      await uploadBytes(starsRef, this.file).then((snapshot) => {
        console.log(snapshot)
      });

      await getDownloadURL(starsRef)
        .then((url) => {
          this.url = url;
          this.profilePicture = url;
        })
    }
    this.chooseImage = false;
  }

  async addMember() {
    if (this.file) {
      this.globalVariables.newMember.avatar = this.url;
    } else {
      this.globalVariables.newMember.avatar = this.profilePicture;
    }
    this.updateMember();
  }

  async updateMember() {
    const newMember: Member = {
      member: this.globalVariables.newMember.member,
      email: this.globalVariables.newMember.email,
      password: this.globalVariables.newMember.password,
      avatar: this.globalVariables.newMember.avatar
    }

    await createUserWithEmailAndPassword(this.auth, this.globalVariables.newMember.email, this.globalVariables.newMember.password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: this.globalVariables.newMember.member, photoURL: this.globalVariables.newMember.avatar
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Fehler bei der Registrierung:', errorCode, errorMessage);
        this.user_already_exists = true;
      });

    if (!this.user_already_exists) {
      this.firestoreService.addMember(newMember);
      this.successSignIn = true;

      setTimeout(() => {
        this.successSignIn = true;
        this.router.navigate(['log-in']);
      }, 2000);
    }
  }
}
