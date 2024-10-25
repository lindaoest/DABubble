import { Component, Input } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { DirectMessage } from '../../../../models/direct-message.class';
import { Thread } from '../../../../models/thread.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-writing-box',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './writing-box.component.html',
  styleUrl: './writing-box.component.scss'
})
export class WritingBoxComponent {

  @Input() sendMessage: string = '';
  @Input() messageToReplyTo: Message = {
    channel: '',
    text: '',
    time: '',
    sender: '',
    avatar: '',
    creationDate: 0,
    timeStamp: 0
  };
  @Input() activeMember: any;
  @Input() name: string = '';

  description: string = '';

  //Subscription
  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public globalVariables: GlobalVariablesService, public firestoreService: FirestoreService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });
  }

  ngOnDestroy() {
    this.activeChatSubscription.unsubscribe();
  }

  async addMessage() {
    if (this.sendMessage == 'message') {
      const message: Message = new Message({
        channel: this.activeChat ? this.globalVariables.activeChannel.name : this.globalVariables.channelWithLoggedInUser.name,
        text: this.description,
        time: this.globalVariables.currentTime(),
        sender: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })
      this.firestoreService.addMessage(message);

    } else if (this.sendMessage == 'direct_message') {
      const direct_message: DirectMessage = new DirectMessage({
        sender: this.globalVariables.signed_in_member.displayName,
        receiver: this.activeMember[0].member,
        text: this.description,
        time: this.globalVariables.currentTime(),
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })
      this.firestoreService.addDirectMessage(direct_message);

    } else if (this.sendMessage == 'thread') {
      const thread: Thread = new Thread({
        channel: this.activeChat ? this.globalVariables.activeChannel.name : this.globalVariables.channelWithLoggedInUser.name,
        text: this.description,
        time: this.globalVariables.currentTime(),
        sender: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime(),
        message: this.messageToReplyTo
      })
      this.firestoreService.addThread(thread);
    } else if (this.sendMessage == 'create_new_message') {
      const create_new_message: DirectMessage = new DirectMessage({
        sender: this.globalVariables.signed_in_member.displayName,
        receiver: this.name.substring(1),
        text: this.description,
        time: this.globalVariables.currentTime(),
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })

      await this.firestoreService.addDirectMessage(create_new_message);
      this.globalVariables.certainMember_Array = [];
    }

    this.description = '';
  }
}
