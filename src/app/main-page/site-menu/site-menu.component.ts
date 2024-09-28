import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Messenges } from '../../../models/messenges.class';
import { DirectmessagesChatComponent } from '../chat/directmessages-chat/directmessages-chat.component';
import { DirectMessage } from '../../../models/direct-message.class';
import { Member } from '../../../models/member.class';

@Component({
  selector: 'app-site-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {

  name: string = '';
  description: string = '';
  members: [] = [];
  channel_open: Boolean = false;
  directmessage_open: Boolean = false;
  filteredChats: Messenges[] = [];
  //globalVariables.personObjArray: any[] = [];
  channels: Channel[] = [];

  constructor(public dialog: MatDialog, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  getList() {
    this.channelFirestore.channels$.subscribe(channels => {
      this.channels = channels.filter((channel: Channel) =>
        channel.members.some((user: Member) => user && user.member === this.globalVariables.signed_in_member.displayName)
      );
    });
    return this.channels;
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members },
    });
  }

  openChat(channelName: string) {
    this.globalVariables.open_directmessages_chat = false;
    this.globalVariables.create_new_chat = false;
    this.globalVariables.activeChat = channelName;
    if (this.globalVariables.activeChannel) {
      this.channelFirestore.channels$.subscribe(channels => {
        const foundChannel = channels.find((obj:any) => obj.name === channelName);
        if (foundChannel) {
          this.globalVariables.activeChannel = foundChannel;
          this.filterChats();
        } else {
          console.warn('Channel not found');
        }
      });
    }
  }

  filterChats() {
    this.globalVariables.messenges = [];
    this.filteredChats = this.channelFirestore.messenges.filter(chat => chat.channel === this.globalVariables.activeChannel.name);
    this.filteredChats.forEach(element => {
      this.globalVariables.messenges.push(this.channelFirestore.setObjectMessenges(element, ''));
    });
  }

  channel_open_function() {
    this.channel_open = !this.channel_open;
  }

  directmessage_open_function() {
    this.directmessage_open = !this.directmessage_open;

    this.channelFirestore.direct_message.forEach(message => {
      if (message.sender == this.globalVariables.signed_in_member.displayName) {
        let direct_message_receiver = this.channelFirestore.members.find(member => message.receiver == member.member);
        if(direct_message_receiver && !this.globalVariables.personObjArray.some(person => person.member === direct_message_receiver.member)) {
          console.log('member1', direct_message_receiver);
          this.globalVariables.personObjArray.push(direct_message_receiver);
          console.log('receiver', this.globalVariables.personObjArray)
        }
      } else if (message.receiver == this.globalVariables.signed_in_member.displayName) {
        let direct_message_sender = this.channelFirestore.members.find(member => message.sender == member.member);
        if(direct_message_sender && !this.globalVariables.personObjArray.some(person => person.member === direct_message_sender.member)) {
          console.log('member2', direct_message_sender);
          this.globalVariables.personObjArray.push(direct_message_sender);
          console.log('sender', this.globalVariables.personObjArray)
        }
      }
    });
  }

  open_new_chat() {
    this.globalVariables.open_directmessages_chat = false;
    this.globalVariables.create_new_chat = true;
  }

  async open_directmessages_chat(receiver: string) {
    this.globalVariables.create_new_chat = false;
    this.globalVariables.open_directmessages_chat = true;
    localStorage.setItem('active privatechat', JSON.stringify(receiver));

    let get_active_chat = localStorage.getItem('active privatechat');

    if (get_active_chat) {
      this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
    }
  }

  uniqueReceivers(messages: any) {
    // console.log('messages', messages)
    // const receivers = new Set();
    // messages.forEach(message => {
    //   if (message.sender === this.globalVariables.signed_in_member.displayName) {
    //     receivers.add(message.receiver);
    //   } else if (message.receiver === this.globalVariables.signed_in_member.displayName) {
    //     receivers.add(message.sender);
    //   }
    // });
    // return Array.from(receivers);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
