import { Component } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  activeChat: string = '';

  constructor(public globalVariables: GlobalVariablesService) {}

  ngOnInit(): void {
    this.activeChat = this.globalVariables.activeChat;
    console.log('activeChat', this.activeChat)
  }
}
