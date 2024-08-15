import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { getAuth, signOut, updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../../app.config-private';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  edit_profile_form: FormGroup = new FormGroup({});

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>, public globalVariables: GlobalVariablesService, public firestore: FirestoreService, private router: Router,) { }

  ngOnInit() {
    this.edit_profile_form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    const updateMember = this.firestore.members.find(obj => obj.email === this.globalVariables.signed_in_member.email && obj.member === this.globalVariables.signed_in_member.displayName);

    const member: Member = {
      id: updateMember.id,
      member: this.edit_profile_form.value.member,
      email: this.edit_profile_form.value.email,
      password: updateMember.password,
      avatar: updateMember.avatar
    }
    this.firestore.updateMember('members', member);

    this.updateAuthentification();
    this.dialogRef.close();
  }

  updateAuthentification() {
    const user = this.auth.currentUser;
    const newEmail = this.edit_profile_form.value.email;
    const newUsername = this.edit_profile_form.value.member;

    this.globalVariables.verifyText = true;

    if (user) {
      updateProfile(user, {
        displayName: newUsername
      }).then(() => {

        this.firebaseEmailReset(user, newEmail);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  firebaseEmailReset(user:any, email: any) {
    const auth = getAuth();
    try {
        verifyBeforeUpdateEmail(user, email);
        setTimeout(() => {
          signOut(auth).then(() => {
            this.router.navigate(['log-in']);
            this.globalVariables.verifyText = false;
          }).catch((error) => {
            console.log('logOut', error);
          });
        }, 4000);
    } catch(error) {

    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
