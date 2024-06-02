import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Subscription } from 'rxjs';
import { DialogOverviewChannelComponent } from '../dialog-overview-channel/dialog-overview-channel.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  name:string = ''
  description: string = ''

  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public dialog: MatDialog, public globalVariables: GlobalVariablesService, public channelFirestore: FirestoreService) {}

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

  openDialog(): void {
    const activeChannel = this.channelFirestore.channels.find(obj => obj.name === this.activeChat);
    this.dialog.open(DialogOverviewChannelComponent, {
      data: activeChannel
    });
  }
}
