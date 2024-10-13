import { Component, HostListener } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadReplyComponent } from './thread-reply/thread-reply.component';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { DirectmessagesChatComponent } from './chat/directmessages-chat/directmessages-chat.component';
import { Messenges } from '../../models/messenges.class';
import { ButtonCloseMenuComponent } from '../button-close-menu/button-close-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, SiteMenuComponent, ChatComponent, ThreadReplyComponent, DirectmessagesChatComponent, ButtonCloseMenuComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  currentMessage: Messenges = {
    channel: '',
    text: '',
    time: '',
    sender: '',
    avatar: '',
    creationDate: 0,
    timeStamp: 0
  };

  showMenu: boolean = true;
  showChat: boolean = false;
  showDirectChat: boolean = false;
  showThreads: boolean = false;

  constructor(public globalVariables: GlobalVariablesService) {}

  message_for_thread(message: Messenges) {
    this.currentMessage = message;
  }

  openChat() {
    this.showMenu = false;
    this.showChat = true;
    this.showDirectChat = false;
    this.showThreads = false;
  }

  openDirectChat() {
    this.showMenu = false;
    this.showChat = false;
    this.showDirectChat = true;
    this.showThreads = false;
  }

  openThread() {
    this.showMenu = false;
    this.showChat = false;
    this.showDirectChat = false;
    this.showThreads = true;
  }

  goBack() {
    this.showMenu = true;
    this.showChat = false;
    this.showDirectChat = false;
    this.showThreads = false;
  }
}
