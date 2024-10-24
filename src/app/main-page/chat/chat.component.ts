import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { find, Subscription, tap } from 'rxjs';
import { DialogOverviewChannelComponent } from '../dialog-overview-channel/dialog-overview-channel.component';
import { Channel } from '../../../models/channel.class';
import { DialogMemberExistingChannelComponent } from '../dialog-member-existing-channel/dialog-member-existing-channel.component';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../app.config-private';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../models/message.class';
import { CreateNewChatComponent } from './create-new-chat/create-new-chat.component';
import { WritingBoxComponent } from '../../shared/components/writing-box/writing-box.component';
import { DateBlockMessageComponent } from '../../shared/components/date-block-message/date-block-message.component';
import { Member } from '../../../models/member.class';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateNewChatComponent, WritingBoxComponent, DateBlockMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Output() mobileClickedThread = new EventEmitter();
  @Output() currentMessage = new EventEmitter();

  name: string = '';
  channelWithLoggedInUser!: Channel;

  //Authentification firebase
  firebaseConfig = privateConfig;
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  //Subscription
  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  constructor(public dialog: MatDialog, public globalVariables: GlobalVariablesService, public firestoreService: FirestoreService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });

    this.channelSubscription = this.firestoreService.channels$.pipe(
      tap((channels: Channel[]) => {
        this.channels = channels;

        this.channels.some(channel => {
          const member = channel.members.find((findMember: any) => findMember.member === this.globalVariables.signed_in_member.displayName);

          if (member) {
            this.channelWithLoggedInUser = channel;
            return true;
          }

          return false;
        });
      })
    ).subscribe()

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.globalVariables.signed_in_member = user;
      }
    });
  }

  ngOnDestroy() {
    this.activeChatSubscription.unsubscribe();
  }

  /**
   * Retrieves the list of members from the active channel.
   *
   * @function getMembers
   * @memberof YourComponent
   * @returns any - An array of members from the active channel.
   */
  getMembers() {
    return this.globalVariables.activeChannel.members;
  }

  /**
   * Opens a dialog for the active channel and ensures the active chat is set.
   * Subscribes to `channels$` from `firestoreService`, searches for the active chat within the channels,
   * sets the active channel in `globalVariables`, and opens a dialog to display the channel data.
   *
   * @returns {void}
   */
  openDialogChannel(): void {
    if (this.globalVariables.activeChannel) {
      this.firestoreService.channels$.subscribe((channels: any) => {
        if (!this.activeChat) {
          this.activeChat = channels[0].name;
        }
        const foundChannel = channels.find((obj: any) => obj.name === this.activeChat);
        if (foundChannel) {
          this.globalVariables.activeChannel = foundChannel;
        } else {
          console.warn('Channel not found');
        }
      });
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.globalVariables.activeChannel
      });
    }
  }

  /**
   * Opens a dialog to add members to the active channel.
   *
   * @returns {void}
   */
  addMembers() {
    this.dialog.open(DialogMemberExistingChannelComponent, {
      data: this.globalVariables.activeChannel
    });
  }

  /**
   * Starts a thread by emitting the selected message and triggers the mobile thread click event.
   *
   * @param  message - Message
   * @returns - void
   */
  start_thread(message: Message) {
    this.currentMessage.emit(message);
    this.mobileClickedThread.emit();
  }
}
