import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { getAuth, signOut, updateProfile, User, verifyBeforeUpdateEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../../app.config-private';
import { Router } from '@angular/router';
import { Messenges } from '../../../../models/messenges.class';
import { DirectMessage } from '../../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Thread } from '../../../../models/thread.class';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  edit_profile_form: FormGroup = new FormGroup({});

  memberName = this.globalVariables.signed_in_member.displayName;
  memberEmail = this.globalVariables.signed_in_member.email;

  firebaseConfig = privateConfig;
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  //Subscription
  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>, public globalVariables: GlobalVariablesService, public firestore: FirestoreService, private router: Router) { }

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
    this.updateMemberFunction();
    this.updateMessageFunction();
    this.updateDirectMessageFunction();
    this.updateChannelFunction();
    this.updateThreadFunction();

    this.updateAuthentification();
    this.dialogRef.close();
  }

  updateMemberFunction() {
    const updateMember = this.firestore.members.find(obj => obj.email === this.memberEmail && obj.member === this.memberName);

    const member: Member = {
      id: updateMember.id,
      member: this.edit_profile_form.value.member,
      email: this.edit_profile_form.value.email,
      password: updateMember.password,
      avatar: updateMember.avatar
    }
    this.firestore.updateMember('members', member);
  }

  updateMessageFunction() {
    const updateMessages = this.firestore.messenges.filter(message => message.sender === this.memberName);

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
  }

  updateDirectMessageFunction() {
    this.firestore.direct_message
      .filter(directMessage => directMessage.sender === this.memberName || directMessage.receiver === this.memberName)
      .forEach(directMessage => {
        const directMessageUpdate: DirectMessage = {
          ...directMessage, // copy all fields from the origin
          sender: directMessage.sender === this.memberName ? this.edit_profile_form.value.member : directMessage.sender,
          receiver: directMessage.receiver === this.memberName ? this.edit_profile_form.value.member : directMessage.receiver
        };
        this.firestore.updateDirectMessage('direct-message', directMessageUpdate);
      });
  }

  updateChannelFunction() {
    this.channels.forEach(updateChannel => {
      let membersArray: Member[] = updateChannel.members.map(updateMember => ({
        ...updateMember,
        member: updateMember.member === this.memberName ? this.edit_profile_form.value.member : updateMember.member,
        email: updateMember.member === this.memberName ? this.edit_profile_form.value.email : updateMember.email
      }));

      const channel: Channel = {
        ...updateChannel,
        members: membersArray,
        creator: updateChannel.creator === this.memberName ? this.edit_profile_form.value.member : updateChannel.creator
      };
      this.firestore.updateData('channels', channel);
    });
  }


  updateThreadFunction() {
    const updateThread = this.firestore.threads.filter(thread => thread.sender === this.globalVariables.signed_in_member.displayName);

    updateThread.forEach(updateThread => {
      const thread: Thread = {
        id: updateThread.id,
        channel: updateThread.channel,
        text: updateThread.text,
        time: updateThread.time,
        sender: this.edit_profile_form.value.member,
        avatar: updateThread.avatar,
        creationDate: updateThread.creationDate,
        timeStamp: updateThread.timeStamp,
        message: updateThread.message
      }
      this.firestore.updateThread('threads', thread)
    })
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

  firebaseEmailReset(user: User, email: string) {
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
      console.log(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
