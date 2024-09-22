import { Component } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadReplyComponent } from './thread-reply/thread-reply.component';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { DirectmessagesChatComponent } from './chat/directmessages-chat/directmessages-chat.component';
import { Messenges } from '../../models/messenges.class';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SiteMenuComponent, ChatComponent, ThreadReplyComponent, DirectmessagesChatComponent],
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

  constructor(public globalVariables: GlobalVariablesService) {}

  message_for_thread(message: Messenges) {
    this.currentMessage = message;
  }
}
