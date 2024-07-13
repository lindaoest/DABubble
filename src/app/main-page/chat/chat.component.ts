import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Subscription } from 'rxjs';
import { DialogOverviewChannelComponent } from '../dialog-overview-channel/dialog-overview-channel.component';
import { Channel } from '../../../models/channel.class';
import { DialogMemberExistingChannelComponent } from '../dialog-member-existing-channel/dialog-member-existing-channel.component';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../app.config-private';
import { FormsModule } from '@angular/forms';
import { Messenges } from '../../../models/messenges.class';
import { CreateNewChatComponent } from './create-new-chat/create-new-chat.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateNewChatComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  name: string = '';
  description: string = '';

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public dialog: MatDialog, public globalVariables: GlobalVariablesService, public channelFirestore: FirestoreService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.globalVariables.signed_in_member = user;
      }
    });

    const user = this.auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      console.log('email', email);

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
    }
  }

  ngOnDestroy() {
    if (this.activeChatSubscription) {
      this.activeChatSubscription.unsubscribe();
    }
  }

  getMembers() {
    return this.globalVariables.activeChannel.members;
  }

  openDialog(): void {
    if (this.globalVariables.activeChannel) {
      if (!this.activeChat) {
        this.activeChat = this.channelFirestore.channels[0].name;
      }
      const foundChannel = this.channelFirestore.channels.find(obj => obj.name === this.activeChat);
      if (foundChannel) {
        this.globalVariables.activeChannel = foundChannel;
      } else {
        console.warn('Channel not found');
      }
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.globalVariables.activeChannel
      });
    }
  }

  addMembers() {
    this.dialog.open(DialogMemberExistingChannelComponent, {
      data: this.globalVariables.activeChannel
    });
  }

  addMessage() {
    const message: Messenges = new Messenges({
      channel: this.globalVariables.activeChannel.name,
      text: this.description,
      time: this.currentTime(),
      sender: this.globalVariables.signed_in_member.displayName,
      avatar: this.globalVariables.signed_in_member.photoURL,
      creationDate: new Date().toISOString().slice(0, 10)
    })
    this.channelFirestore.addMessage(message)
    this.description = '';
  }

  currentTime() {
    let date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
