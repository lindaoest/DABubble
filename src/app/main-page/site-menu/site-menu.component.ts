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

  constructor(public dialog: MatDialog, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  getList() {
    return this.channelFirestore.channels;
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
      // if(!channelName) {
      //   this.activeChat = this.channelFirestore.channels[0].name;
      // }
      const foundChannel = this.channelFirestore.channels.find(obj => obj.name === channelName);
      if (foundChannel) {
        this.globalVariables.activeChannel = foundChannel;
        this.filterChats();
        console.log(this.globalVariables.activeChannel)
      } else {
        console.warn('Channel not found');
      }
      // this.dialog.open(DialogOverviewChannelComponent, {
      //   data: this.activeChannel
      // });
    }
  }

  filterChats() {
    this.globalVariables.messenges = [];
    this.filteredChats = this.channelFirestore.messenges.filter(chat => chat.channel === this.globalVariables.activeChannel.name);
    this.filteredChats.forEach(element => {
      this.globalVariables.messenges.push(this.channelFirestore.setObjectMessenges(element, ''));
    });
    console.log('filteredChats', this.globalVariables.messenges)
  }

  channel_open_function() {
    this.channel_open = !this.channel_open;
  }

  directmessage_open_function() {
    this.directmessage_open = !this.directmessage_open;
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

    if(get_active_chat) {
      this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
    }
  }

  uniqueReceivers(messages: any[]): any[] {
    const seen = new Set();
    return messages.filter(message => {
      if (seen.has(message.receiver)) {
        return false;
      } else {
        seen.add(message.receiver);
        return true;
      }
    });
  }
}
