import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Message } from '../../../models/message.class';
import { Member } from '../../../models/member.class';
import { DirectMessage } from '../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { SiteMenuDropDownComponent } from '../../shared/components/site-menu-drop-down/site-menu-drop-down.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-site-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SiteMenuDropDownComponent,
  ],
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {

  @Output()
  public mobileClickedChat = new EventEmitter();

  @Output()
  public mobileClickedDirectChat = new EventEmitter();

  public description: string = '';
  public filteredChats: Message[] = [];
  public members: [] = [];
  public name: string = '';
  public personObjArray: Member[] = [];

  //Subscription
  private channelSubscription: Subscription = new Subscription;
  public channels: Channel[] = [];

  private directMessageSubscription: Subscription = new Subscription;
  public direct_messages: DirectMessage[] = [];

  constructor(
    public dialog: MatDialog,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) {
    this.directMessageSubscription = this.firestoreService.directMessages$.subscribe(directMessage => {
      this.direct_messages = directMessage;

      this.showDirectMessages();
    });
  }

  ngOnDestroy() {
    this.directMessageSubscription.unsubscribe();
    this.channelSubscription.unsubscribe();
  }

  public getList() {
    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels.filter((channel: Channel) =>
        channel.members.some((user: Member) => user && user.member === this.globalVariables.signed_in_member.displayName)
      );
    });

    return this.channels;
  }

  public openChannel(channelName: string) {
    this.globalVariables.showDirectMessagesChat = false;
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showChat = true;
    this.globalVariables.activeChat = channelName;

    this.setActiveChannel(channelName);

    this.mobileClickedChat.emit();
  }

  public setActiveChannel(channelName: string) {
    this.firestoreService.channels$.subscribe(channels => {
      const foundChannelName = channels.find((obj: Channel) => obj.name === channelName);
      if (foundChannelName) {
        this.globalVariables.activeChannel = foundChannelName;
      } else {
        console.error('Channel not found');
      }
    });
  }

  public showDirectMessages() {
    this.direct_messages.forEach(message => {
      if (message.sender == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_sender(message);
      } else if (message.receiver == this.globalVariables.signed_in_member.displayName) {
        this.show_all_directmessages_receiver(message);
      }
    });
  }

  public show_all_directmessages_sender(message: DirectMessage) {
    let direct_message_receiver = this.firestoreService.members.find(member => message.receiver == member.member);
    if (direct_message_receiver && !this.personObjArray.some(person => person.member === direct_message_receiver!.member)) {
      this.personObjArray.push(direct_message_receiver);
    }
  }

  public show_all_directmessages_receiver(message: DirectMessage) {
    let direct_message_sender = this.firestoreService.members.find(member => message.sender == member.member);
    if (direct_message_sender && !this.personObjArray.some(person => person.member === direct_message_sender!.member)) {
      this.personObjArray.push(direct_message_sender);
    }
  }

  public open_new_chat() {
    this.globalVariables.showDirectMessagesChat = false;
    this.globalVariables.create_new_chat = true;
    this.mobileClickedChat.emit();
  }

  public showDirectMessagesChat(receiver: string) {
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showDirectMessagesChat = true;
    localStorage.setItem('active privatechat', JSON.stringify(receiver));

    let get_active_chat = localStorage.getItem('active privatechat');

    if (get_active_chat) {
      this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
    }

    this.mobileClickedDirectChat.emit();
  }
}
