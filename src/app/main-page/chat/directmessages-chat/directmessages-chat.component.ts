import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-directmessages-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  ngOnInit() {
    console.log('active', this.globalVariables.active_privatechat)
  }

  test(m: string) {
    console.log('m', m)
  }
}
