import { Component } from '@angular/core';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Member } from '../../models/member.class';
import { Router, RouterModule } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../app.config-private';
import { AuthContainerComponent } from '../auth-container/auth-container.component';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [
    AuthContainerComponent,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  private firebaseConfig = privateConfig;
  private app = initializeApp(this.firebaseConfig);
  private auth = getAuth(this.app);

  public imageIsSelected: boolean = true;
  public newMember!: Member;
  public profilePicture = "./assets/img/channels/profile.svg";
  public showSuccessOverlay: boolean = false;
  public userAlreadyExists: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public router: Router,
  ) { }

  ngOnInit() {
    const newMemberData = sessionStorage.getItem('new Member');
    if (newMemberData) {
      this.newMember = JSON.parse(newMemberData);
    }
  }

  public addImage(item: number) {
    this.profilePicture = `./assets/img/avatar/avatar-${item}.svg`;
    this.imageIsSelected = false;
  }

  public async addOwnFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const storage = getStorage();
      const starsRef = ref(storage, `images/${file.name}`);

      await uploadBytes(starsRef, file);

      await getDownloadURL(starsRef)
        .then((url) => {
          this.profilePicture = url;
        })
    }
    this.imageIsSelected = false;
  }

  public async addMember() {
    const newMember: Member = {
      member: this.newMember.member,
      email: this.newMember.email,
      password: this.newMember.password,
      avatar: this.profilePicture,
      isOnline: false
    }

    await this.createUserProfile();

    if (!this.userAlreadyExists) {
      this.firestoreService.addMember(newMember);
      this.showSuccessOverlay = true;

      setTimeout(() => {
        this.showSuccessOverlay = true;
        this.router.navigate(['log-in']);
      }, 2000);
    }
  }

  public async createUserProfile() {
    await createUserWithEmailAndPassword(this.auth, this.newMember.email, this.newMember.password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: this.newMember.member, photoURL: this.profilePicture
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Fehler bei der Registrierung:', errorCode, errorMessage);
        this.userAlreadyExists = true;
      });
  }
}
