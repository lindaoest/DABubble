import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Subscription } from 'rxjs';
import { DialogOverviewChannelComponent } from '../dialog-overview-channel/dialog-overview-channel.component';
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  name: string = '';
  description: string = '';

  activeChannel: Channel = {
    id: '',
    name: '',
    members: [],
    description: ''
  };

  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public dialog: MatDialog, public globalVariables: GlobalVariablesService, public channelFirestore: FirestoreService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });
  }

  ngOnDestroy() {
    if (this.activeChatSubscription) {
      this.activeChatSubscription.unsubscribe();
    }
  }

  getMembers() {
    return this.activeChannel.members;
  }

  openDialog(): void {
    if (this.activeChannel) {
      const foundChannel = this.channelFirestore.channels.find(obj => obj.name === this.activeChat);
      if (foundChannel) {
        this.activeChannel = foundChannel;
      } else {
        console.warn('Channel not found');
      }
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.activeChannel
      });
    }
  }
}
