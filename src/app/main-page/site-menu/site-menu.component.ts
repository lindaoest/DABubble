import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Message } from '../../../models/message.class';
import { Member } from '../../../models/member.class';
import { DirectMessage } from '../../../models/direct-message.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {

  @Output() mobileClickedChat = new EventEmitter();
  @Output() mobileClickedDirectChat = new EventEmitter();

  name: string = '';
  description: string = '';
  members: [] = [];
  channel_open: boolean = false;
  directmessage_open: boolean = false;
  filteredChats: Message[] = [];

  //Subscription
  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  personObjArray_Subsription: Subscription = new Subscription;
  personObjArray: Member[] = [];

  directMessageSubscription: Subscription = new Subscription;
  direct_messages: DirectMessage[] = [];

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.directMessageSubscription = this.firestoreService.directMessages$.subscribe(directMessage => {
      this.direct_messages = directMessage;
    });

    this.personObjArray_Subsription = this.globalVariables.personObjArray$.subscribe(member => {
      this.personObjArray = member;
    });
  }

  ngOnDestroy() {
    this.directMessageSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
    this.personObjArray_Subsription.unsubscribe();
  }

  getList() {
    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels.filter((channel: Channel) =>
        channel.members.some((user: Member) => user && user.member === this.globalVariables.signed_in_member.displayName)
      );
    });

    return this.channels;
  }

  openDialogAddChannel(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members },
    });
  }

  openChat(channelName: string) {
    this.globalVariables.open_directmessages_chat = false;
    this.globalVariables.create_new_chat = false;
    this.globalVariables.mobile_chat = true;
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

  channel_open_function() {
    this.channel_open = !this.channel_open;
  }

  directmessage_open_function() {
    this.directmessage_open = !this.directmessage_open;

    this.direct_messages.forEach(message => {
      if (message.sender == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_sender(message);
      } else if (message.receiver == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_receiver(message);
      }
    });

    this.globalVariables.personObjArray = this.personObjArray;
  }

  show_all_directmessages_sender(message: DirectMessage) {
    let direct_message_receiver = this.firestoreService.members.find(member => message.receiver == member.member);
    if (direct_message_receiver && !this.personObjArray.some(person => person.member === direct_message_receiver!.member)) {
      this.personObjArray.push(direct_message_receiver);
    }
  }

  show_all_directmessages_receiver(message: DirectMessage) {
    let direct_message_sender = this.firestoreService.members.find(member => message.sender == member.member);
    if (direct_message_sender && !this.personObjArray.some(person => person.member === direct_message_sender!.member)) {
      this.personObjArray.push(direct_message_sender);
    }
  }

  open_new_chat() {
    this.globalVariables.open_directmessages_chat = false;
    this.globalVariables.create_new_chat = true;
    this.mobileClickedChat.emit();
  }

  open_directmessages_chat(receiver: string) {
    this.globalVariables.create_new_chat = false;
    this.globalVariables.open_directmessages_chat = true;
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
