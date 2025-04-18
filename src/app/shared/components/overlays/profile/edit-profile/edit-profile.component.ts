import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalVariablesService } from '../../../../../core/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../../core/services/firestore/firestore.service';
import { Member } from '../../../../../../models/member.class';
import { getAuth, signOut, updateProfile, User, verifyBeforeUpdateEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../../../../app.config-private';
import { Router } from '@angular/router';
import { Message } from '../../../../../../models/message.class';
import { DirectMessage } from '../../../../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { Channel } from '../../../../../../models/channel.class';
import { Thread } from '../../../../../../models/thread.class';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  public form: FormGroup = new FormGroup({});

  public memberName = this.globalVariables.signed_in_member.displayName;
  public memberEmail = this.globalVariables.signed_in_member.email;

  private firebaseConfig = privateConfig;
  private app = initializeApp(this.firebaseConfig);
  private auth = getAuth(this.app);

  //Subscription
  private channelSubscription: Subscription = new Subscription;
  public channels: Channel[] = [];

  private directMessageSubscription: Subscription = new Subscription;
  public direct_messages: DirectMessage[] = [];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels;
    });

    this.directMessageSubscription = this.firestoreService.directMessages$.subscribe(direct_messages => {
      this.direct_messages = direct_messages;
    });
  }

  ngOnDestroy() {
    this.channelSubscription.unsubscribe();
    this.directMessageSubscription.unsubscribe();
  }

  public onSubmit() {
    this.updateMemberFunction();
    this.updateMessageFunction();
    this.updateDirectMessageFunction();
    this.updateChannelFunction();
    this.updateThreadFunction();

    this.updateAuthentification();
    this.dialogRef.close();
  }

  //TODO Vielleicht das Speichern in Firebase verbessern?
  public updateMemberFunction() {
    const updateMember = this.firestoreService.members.find(obj => obj.email === this.memberEmail && obj.member === this.memberName);
    if(updateMember) {
      const member: Member = {
        id: updateMember.id,
        member: this.form.value.member,
        email: this.form.value.email,
        password: updateMember.password,
        avatar: updateMember.avatar,
        isOnline: updateMember.isOnline
      }
      this.firestoreService.updateMember('members', member);
    }
  }

  public updateMessageFunction() {
    const updateMessages = this.firestoreService.messages.filter(message => message.sender === this.memberName);

    updateMessages.forEach(updateMessage => {
      const message: Message = {
        id: updateMessage.id,
        channel: updateMessage.channel,
        text: updateMessage.text,
        time: updateMessage.time,
        sender: this.form.value.member,
        avatar: updateMessage.avatar,
        creationDate: updateMessage.creationDate,
        timeStamp: updateMessage.timeStamp
      }
      this.firestoreService.updateMessage('messages', message)
    })
  }

  public updateDirectMessageFunction() {
    this.direct_messages
      .filter(directMessage => directMessage.sender === this.memberName || directMessage.receiver === this.memberName)
      .forEach(directMessage => {
        const directMessageUpdate: DirectMessage = {
          ...directMessage, // copy all fields from the origin
          sender: directMessage.sender === this.memberName ? this.form.value.member : directMessage.sender,
          receiver: directMessage.receiver === this.memberName ? this.form.value.member : directMessage.receiver
        };
        this.firestoreService.updateDirectMessage('direct-messages', directMessageUpdate);
      });
  }

  public updateChannelFunction() {
    this.channels.forEach(updateChannel => {
      let membersArray: Member[] = updateChannel.members.map(updateMember => ({
        ...updateMember,
        member: updateMember.member === this.memberName ? this.form.value.member : updateMember.member,
        email: updateMember.member === this.memberName ? this.form.value.email : updateMember.email
      }));

      const channel: Channel = {
        ...updateChannel,
        members: membersArray,
        creator: updateChannel.creator === this.memberName ? this.form.value.member : updateChannel.creator
      };
      this.firestoreService.updateChannel('channels', channel);
    });
  }


  public updateThreadFunction() {
    const updateThread = this.firestoreService.threads.filter(thread => thread.sender === this.globalVariables.signed_in_member.displayName);

    updateThread.forEach(updateThread => {
      const thread: Thread = {
        id: updateThread.id,
        channel: updateThread.channel,
        text: updateThread.text,
        time: updateThread.time,
        sender: this.form.value.member,
        avatar: updateThread.avatar,
        creationDate: updateThread.creationDate,
        timeStamp: updateThread.timeStamp,
        message: updateThread.message
      }
      this.firestoreService.updateThread('threads', thread)
    })
  }

  private updateAuthentification() {
    const user = this.auth.currentUser;
    const newEmail = this.form.value.email;
    const newUsername = this.form.value.member;

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

  private firebaseEmailReset(user: User, email: string) {
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

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
