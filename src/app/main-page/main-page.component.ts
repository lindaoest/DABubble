import { Component } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadReplyComponent } from './thread-reply/thread-reply.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SiteMenuComponent, ChatComponent, ThreadReplyComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
