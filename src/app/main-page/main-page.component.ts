import { Component } from '@angular/core';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SiteMenuComponent, ChatComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
