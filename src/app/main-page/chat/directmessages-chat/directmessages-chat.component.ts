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

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

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

  isRelevantGroup(key: string): boolean {
    const signedInMember = this.globalVariables.signed_in_member.displayName;
    const activePrivateChat = this.globalVariables.active_privatechat;
    const participants = [signedInMember, activePrivateChat].sort().join('-');
    return key === participants;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

}
