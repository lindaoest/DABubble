import { Component } from '@angular/core';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-directmessages-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './directmessages-chat.component.html',
  styleUrl: './directmessages-chat.component.scss'
})
export class DirectmessagesChatComponent {

  description: string = '';

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {}

  openDialog() {
    
  }

  addMessage() {

  }
}
