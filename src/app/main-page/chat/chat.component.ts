import { Component } from '@angular/core';
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

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  name: string = '';
  description: string = '';

  firebaseConfig = privateConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  activeChannel: Channel = {
    id: '',
    name: '',
    members: [],
    description: ''
  };

  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public dialog: MatDialog, public globalVariables: GlobalVariablesService, public channelFirestore: FirestoreService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        this.globalVariables.signed_in_member = user;
        console.log('uid', user)
        // ...
      } else {
        // User is signed out
        // ...
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
    return this.activeChannel.members;
  }

  openDialog(): void {
    if (this.activeChannel) {
      const foundChannel = this.channelFirestore.channels.find(obj => obj.name === this.activeChat);
      if (foundChannel) {
        this.activeChannel = foundChannel;
      } else {
        console.warn('Channel not found');
      }
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.activeChannel
      });
    }
  }

  addMembers() {
    this.dialog.open(DialogMemberExistingChannelComponent, {
      data: this.activeChannel
    });
  }
}
