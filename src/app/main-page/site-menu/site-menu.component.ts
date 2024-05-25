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

  channels: Channel[] = [];

  constructor(public dialog: MatDialog, public channelFirestore: FirestoreService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description },
    });

    dialogRef.afterClosed().subscribe(result => {
      const newChannel = new Channel({
        name: result.name,
        description: result.description
      })
      this.channelFirestore.addData(newChannel);
    });
  }

  ngOnInit(): void {
    this.channels = [];
    this.channels = this.channelFirestore.channels;
    console.log('from firestore', this.channels);
  }
}
