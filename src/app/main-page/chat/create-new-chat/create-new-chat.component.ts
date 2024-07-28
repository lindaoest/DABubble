import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { DirectMessage } from '../../../../models/direct-message.class';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';

@Component({
  selector: 'app-create-new-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-new-chat.component.html',
  styleUrl: './create-new-chat.component.scss'
})
export class CreateNewChatComponent {

  placeholder_value: string = "An: #channel, oder @jemand";
  name: string = '';
  description: string = '';
  message_to_direct_message: boolean = false;

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  observe_input() {
    if (this.name.includes('@')) {
      this.message_to_direct_message = true;
    }
  }

  addMember(m: string) {
    this.name = '@' + m;
    this.message_to_direct_message = false;
  }

  addMessage() {
    // let filteredDirectMessages = this.channelFirestore.direct_message.filter(message => message.sender === this.globalVariables.signed_in_member.displayName && message.receiver == this.name.substring(1));
    // console.log('test', filteredDirectMessages)

    const message: DirectMessage = new DirectMessage({
      sender: this.globalVariables.signed_in_member.displayName,
      receiver: this.name.substring(1),
      text: this.description,
      time: this.globalVariables.currentTime(),
      avatar: this.globalVariables.signed_in_member.photoURL,
      creationDate: new Date().toISOString().slice(0, 10)
    })

    this.channelFirestore.addDirectMessage(message);
    this.description = '';
  }
}
