import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';

@Component({
  selector: 'app-site-menu',
  standalone: true,
  imports: [],
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {

  name: string = '';
  description: string = '';
  members: [] = [];

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
}
