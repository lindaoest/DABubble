import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Message } from '../../../models/message.class';
import { Member } from '../../../models/member.class';
import { DirectMessage } from '../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { SiteMenuDropDownComponent } from '../../shared/components/site-menu-drop-down/site-menu-drop-down.component';

@Component({
  selector: 'app-site-menu',
  standalone: true,
  imports: [
    CommonModule,
    SiteMenuDropDownComponent
  ],
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {

  @Output() mobileClickedChat = new EventEmitter();
  @Output() mobileClickedDirectChat = new EventEmitter();

  name: string = '';
  description: string = '';
  members: [] = [];
  filteredChats: Message[] = [];

  //Subscription
  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  directMessageSubscription: Subscription = new Subscription;
  direct_messages: DirectMessage[] = [];

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.directMessageSubscription = this.firestoreService.directMessages$.subscribe(directMessage => {
      this.direct_messages = directMessage;

      this.showDirectMessages();
    });
  }

  ngOnDestroy() {
    this.directMessageSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
  }

  getList() {
    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels.filter((channel: Channel) =>
        channel.members.some((user: Member) => user && user.member === this.globalVariables.signed_in_member.displayName)
      );
    });

    return this.channels;
  }

  openChat(channelName: string) {
    this.globalVariables.showDirectChat = false;
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showChat = true;
    this.globalVariables.activeChat = channelName;

    this.setActiveChannel(channelName);

    this.mobileClickedChat.emit();
  }

  setActiveChannel(channelName: string) {
    if (this.globalVariables.activeChannel) {
      this.firestoreService.channels$.subscribe(channels => {
        const foundChannel = channels.find((obj: Channel) => obj.name === channelName);
        if (foundChannel) {
          this.globalVariables.activeChannel = foundChannel;
          this.filterChats();
        } else {
          console.error('Channel not found');
        }
      });
    }
  }

  filterChats() {
    this.globalVariables.messages = [];
    this.filteredChats = this.firestoreService.messages.filter(chat => chat.channel === this.globalVariables.activeChannel.name);
    this.filteredChats.forEach(element => {
      this.globalVariables.messages.push(this.firestoreService.setObjectMessage(element, ''));
    });
  }

  showDirectMessages() {
    this.direct_messages.forEach(message => {
      if (message.sender == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_sender(message);
      } else if (message.receiver == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_receiver(message);
      }
    });
  }

  show_all_directmessages_sender(message: DirectMessage) {
    let direct_message_receiver = this.firestoreService.members.find(member => message.receiver == member.member);
    if (direct_message_receiver && !this.globalVariables.personObjArray.some(person => person.member === direct_message_receiver!.member)) {
      this.globalVariables.personObjArray.push(direct_message_receiver);
    }
  }

  show_all_directmessages_receiver(message: DirectMessage) {
    let direct_message_sender = this.firestoreService.members.find(member => message.sender == member.member);
    if (direct_message_sender && !this.globalVariables.personObjArray.some(person => person.member === direct_message_sender!.member)) {
      this.globalVariables.personObjArray.push(direct_message_sender);
    }
  }

  open_new_chat() {
    this.globalVariables.showDirectChat = false;
    this.globalVariables.create_new_chat = true;
    this.mobileClickedChat.emit();
  }

  showDirectChat(receiver: string) {
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showDirectChat = true;
    localStorage.setItem('active privatechat', JSON.stringify(receiver));

    let get_active_chat = localStorage.getItem('active privatechat');

    if (get_active_chat) {
      this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
    }

    this.mobileClickedDirectChat.emit();
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
