import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';

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
  members: string = '';

  constructor(public dialog: MatDialog, public channelFirestore: FirestoreService) { }

  getList() {
    return this.channelFirestore.channels;
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members},
    });
  }

  allMembers(members:boolean) {
    console.log(members)
  }
}
