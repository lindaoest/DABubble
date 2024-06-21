import { Component } from '@angular/core';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { finalize } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { Member } from '../../models/member.class';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  profilePicture = "./assets/img/channels/profile.svg";
  file: File | null = null;
  chooseImage: boolean = true;
  url: string = '';
  successSignIn: Boolean = false;

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  constructor(public router: Router, public firestore: Firestore, public globalVariables: GlobalVariablesService, public channelFirestore: FirestoreService) { }

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
      this.globalVariables.newMember[0].avatar = this.url;
    } else {
      this.globalVariables.newMember[0].avatar = this.profilePicture;
    }
    this.updateMember();
  }

  updateMember() {
    const newMember: Member = {
      member: this.globalVariables.newMember[0].member,
      email: this.globalVariables.newMember[0].email,
      password: this.globalVariables.newMember[0].password,
      avatar: this.globalVariables.newMember[0].avatar
    }

    createUserWithEmailAndPassword(this.auth, this.globalVariables.newMember[0].email, this.globalVariables.newMember[0].password)
        .then((userCredential) => {
          // Registriert
          const user = userCredential.user;

          updateProfile(user, {
            displayName: this.globalVariables.newMember[0].member, photoURL: this.globalVariables.newMember[0].avatar
          }).then(() => {
            console.log('with name', user)
          }).catch((error) => {
            console.log(error);
          });

          console.log('Registrierung erfolgreich:', user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Fehler bei der Registrierung:', errorCode, errorMessage);
        });

    this.channelFirestore.addMember(newMember);
    this.successSignIn = true;

    setTimeout(() => {
      this.successSignIn = true;
      this.router.navigate(['log-in']);
    }, 2000);
  }
}
