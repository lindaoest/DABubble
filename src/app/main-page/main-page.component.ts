import { Component, HostListener } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadReplyComponent } from './thread-reply/thread-reply.component';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { DirectmessagesChatComponent } from './chat/directmessages-chat/directmessages-chat.component';
import { Message } from '../../models/message.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, SiteMenuComponent, ChatComponent, ThreadReplyComponent, DirectmessagesChatComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  currentMessage: Message = {
    channel: '',
    text: '',
    time: '',
    sender: '',
    avatar: '',
    creationDate: 0,
    timeStamp: 0
  };


  constructor(public globalVariables: GlobalVariablesService) {}

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
