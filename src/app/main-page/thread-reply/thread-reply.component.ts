import { Component, Input } from '@angular/core';
import { Messenges } from '../../../models/messenges.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';
import { Thread } from '../../../models/thread.class';

@Component({
  selector: 'app-thread-reply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thread-reply.component.html',
  styleUrl: './thread-reply.component.scss'
})
export class ThreadReplyComponent {

  name: string = '';
  description: string = '';

  @Input()messageToReplyTo: Messenges = {
    channel: '',
    text: '',
    time: '',
    sender: '',
    avatar: '',
    creationDate: 0,
    timeStamp: 0
  };

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {}

  ngOnChanges() {
    console.log('Thread updated:', this.channelFirestore.groupedThreads);
  }

  addMessage() {
    const thread: Thread = new Thread({
      channel: this.globalVariables.activeChannel.name,
      text: this.description,
      time: this.globalVariables.currentTime(),
      sender: this.globalVariables.signed_in_member.displayName,
      avatar: this.globalVariables.signed_in_member.photoURL,
      creationDate: new Date().toISOString().slice(0, 10),
      timeStamp: new Date().getTime(),
      message: this.messageToReplyTo
    })
    this.channelFirestore.addThread(thread)
    this.description = '';
  }

  close_thread() {
    this.globalVariables.open_thread_reply = false;
  }

}
