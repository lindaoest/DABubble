import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';

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

  constructor(public dialog: MatDialog, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  getList() {
    return this.channelFirestore.channels;
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members},
    });
  }

  openChat(channelName: string) {
    this.globalVariables.activeChat = channelName;
  }

  channel_open_function() {
    this.channel_open = !this.channel_open;
  }

  directmessage_open_function() {
    this.directmessage_open = !this.directmessage_open;
  }
}
