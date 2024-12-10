import { Component, HostListener } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadReplyComponent } from './thread-reply/thread-reply.component';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { DirectmessagesChatComponent } from './chat/directmessages-chat/directmessages-chat.component';
import { Message } from '../../models/message.class';
import { CommonModule } from '@angular/common';
import { filter, Subscription, tap } from 'rxjs';
import { Channel } from '../../models/channel.class';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, SiteMenuComponent, ChatComponent, ThreadReplyComponent, DirectmessagesChatComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  public currentMessage!: Message;
  public paramId!: string | null;

  // Subscription channels
  private channelSubscription: Subscription = new Subscription;
  public channels: Channel[] = [];


  constructor(
    public globalVariables: GlobalVariablesService,
    public firestoreService: FirestoreService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.channelSubscription = this.firestoreService.channels$.pipe(
      tap((channels: Channel[]) => {
        this.channels = channels;

        if (this.channels.length > 0) {
          this.paramId = this.route.children[0]?.snapshot.params['id'];

          if (this.paramId) {
            const activeChannel = this.channels.find(channel => channel.name.toLowerCase() === this.paramId);
            if (activeChannel) {
              this.globalVariables.activeChannel = activeChannel;
            }
          } else {
            let activeChannelFound = false;

            for (const channel of this.channels) {
              const isMemberInChannel = channel.members.some(member =>
                member.member === this.globalVariables.signed_in_member.displayName
              );

              if (isMemberInChannel) {
                this.globalVariables.activeChannel = channel;
                activeChannelFound = true;
                break; // Schleife abbrechen
              }
            }

            // Setze einen leeren Channel, wenn kein aktiver gefunden wurde
            if (!activeChannelFound) {
              this.globalVariables.activeChannel = {
                id: '',
                name: '',
                members: [],
                description: '',
                creator: ''
              };
            }
          }
        }
      })
    ).subscribe();
  }

  message_for_thread(message: Message) {
    this.currentMessage = message;
  }

  openChat() {
    this.globalVariables.showMenu = false;
    this.globalVariables.showChat = true;
    this.globalVariables.showDirectChat = false;
    this.globalVariables.showThreads = false;
  }

  openDirectChat() {
    this.globalVariables.showMenu = false;
    this.globalVariables.showChat = false;
    this.globalVariables.showDirectChat = true;
    this.globalVariables.showThreads = false;
  }

  openThread() {
    this.globalVariables.showMenu = false;
    this.globalVariables.showChat = false;
    this.globalVariables.showDirectChat = false;
    this.globalVariables.showThreads = true;
  }

  goBack() {
    this.globalVariables.showMenu = true;
    this.globalVariables.showChat = false;
    this.globalVariables.showDirectChat = false;
    this.globalVariables.showThreads = false;
  }
}
