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
import { Messenges } from '../../../../models/messenges.class';
import { DirectMessage } from '../../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { Channel } from '../../../../models/channel.class';

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

  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>, public globalVariables: GlobalVariablesService, public firestore: FirestoreService, private router: Router,) { }

  ngOnInit() {
    this.edit_profile_form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.channelSubscription = this.firestore.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  onSubmit() {
    const updateMember = this.firestore.members.find(obj => obj.email === this.globalVariables.signed_in_member.email && obj.member === this.globalVariables.signed_in_member.displayName);
    const updateMessages = this.firestore.messenges.filter(message => message.sender === this.globalVariables.signed_in_member.displayName);
    const updateDirectMessage = this.firestore.direct_message.filter(directMessage => directMessage.sender === this.globalVariables.signed_in_member.displayName || directMessage.receiver === this.globalVariables.signed_in_member.displayName);
    const updateChannel = this.channels.filter(channel => channel.creator === this.globalVariables.signed_in_member.displayName);

    const member: Member = {
      id: updateMember.id,
      member: this.edit_profile_form.value.member,
      email: this.edit_profile_form.value.email,
      password: updateMember.password,
      avatar: updateMember.avatar
    }
    this.firestore.updateMember('members', member);

    updateMessages.forEach(updateMessage => {
      const message: Messenges = {
        id: updateMessage.id,
        channel: updateMessage.channel,
        text: updateMessage.text,
        time: updateMessage.time,
        sender: this.edit_profile_form.value.member,
        avatar: updateMessage.avatar,
        creationDate: updateMessage.creationDate,
        timeStamp: updateMessage.timeStamp
      }
      this.firestore.updateMessage('messenges', message)
    })

    updateDirectMessage.forEach(updateDirectMessage => {
      let directMessage: DirectMessage;
      if (updateDirectMessage.sender === this.globalVariables.signed_in_member.displayName) {
        directMessage = {
          id: updateDirectMessage.id,
          sender: this.edit_profile_form.value.member,
          receiver: updateDirectMessage.receiver,
          text: updateDirectMessage.text,
          time: updateDirectMessage.time,
          avatar: updateDirectMessage.avatar,
          creationDate: updateDirectMessage.creationDate,
        }
      } else {
        directMessage = {
          id: updateDirectMessage.id,
          sender: updateDirectMessage.sender,
          receiver: this.edit_profile_form.value.member,
          text: updateDirectMessage.text,
          time: updateDirectMessage.time,
          avatar: updateDirectMessage.avatar,
          creationDate: updateDirectMessage.creationDate,
        }
      }
      this.firestore.updateDirectMessage('direct-message', directMessage)
    })

    this.channels.forEach(updateChannel => {
      let membersArray: Member[] = [];
      let channel: Channel = {
        id: updateChannel.id,
        name: updateChannel.name,
        description: updateChannel.description,
        members: membersArray,
        creator: updateChannel.creator
      };
      if (updateChannel.creator == this.globalVariables.signed_in_member.displayName) {
        channel = {
          id: updateChannel.id,
          name: updateChannel.name,
          description: updateChannel.description,
          members: membersArray,
          creator: this.edit_profile_form.value.creator
        }
      }
      updateChannel.members.forEach((updateMemberArray: Member) => {
        if (updateMemberArray.member == this.globalVariables.signed_in_member.displayName) {
          membersArray.push({
            member: this.edit_profile_form.value.member,
            email: this.edit_profile_form.value.email,
		        password: updateMemberArray.password,
		        avatar: updateMemberArray.avatar
          })
        } else {
          membersArray.push({
            member: updateMemberArray.member,
            email: updateMemberArray.email,
		        password: updateMemberArray.password,
		        avatar: updateMemberArray.avatar
          })
        }
      })
      this.firestore.updateData('channels', channel)
    })

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

  firebaseEmailReset(user: any, email: any) {
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
    } catch (error) {

    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
