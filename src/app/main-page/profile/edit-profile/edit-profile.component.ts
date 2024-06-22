import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { getAuth, updateEmail, updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../../app.config-private';

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

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>, public globalVariables: GlobalVariablesService, public firestore: FirestoreService) { }

  ngOnInit() {
    this.edit_profile_form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
    });
  }

  onSubmit() {

    const updateMember = this.firestore.members.find(obj => obj.email === this.globalVariables.signed_in_member.email && obj.member === this.globalVariables.signed_in_member.displayName);

    console.log('updateMember', updateMember)

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

    if (user) {
      updateProfile(user, {
        displayName: newUsername
      }).then(() => {
        console.log('with name', user)
        let email = updateEmail(user, newEmail)
        this.firebaseEmailReset(user, email);
        console.log('email', email)
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async firebaseEmailReset(user:any, email: any) {
    try {
        await verifyBeforeUpdateEmail(user, email);
        // await signOut(firebaseAuth);
        window.location.reload();
    } catch(error) {

    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
