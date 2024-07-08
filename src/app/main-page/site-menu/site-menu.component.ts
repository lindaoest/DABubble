import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Messenges } from '../../../models/messenges.class';

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
}
