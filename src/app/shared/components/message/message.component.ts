import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalVariablesService } from '../../../core/services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';
import { ReactionMessageBarComponent } from '../reaction-message-bar/reaction-message-bar.component';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { Thread } from '../../../../models/thread.class';
import { Subscription } from 'rxjs';
import { DirectMessage } from '../../../../models/direct-message.class';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactionMessageBarComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input()
  public message!: any;

  @Input()
  public isThreadMessage: boolean = false;

  @Input()
  public isChatMessage: boolean = false;

  @Input()
  public isDirectMessage: boolean = false;

  @Output()
  public currentMessage = new EventEmitter();

  private directMessageSubscription: Subscription = new Subscription;
  public direct_messages: DirectMessage[] = [];

  public messageIsEditable: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) {
    this.directMessageSubscription = this.firestoreService.directMessages$.subscribe(directMessage => {
      this.direct_messages = directMessage;
    });
  }

  public start_thread(message: Message) {
    this.globalVariables.showThreads = true;
    this.currentMessage.emit(message);
  }

  public editMessage() {
    this.messageIsEditable = true;
  }

  public closeEditbaseMessage() {
    this.messageIsEditable = false;
  }

  public updateEditedMessage() {
    if(this.isChatMessage) this.updateMessage();
    if(this.isChatMessage) this.updateReplyToMessageInThread();
    if(this.isThreadMessage) this.updateThread();
    if(this.isDirectMessage) this.updateDirectMessage();

    this.messageIsEditable = false;
  }

  // TODO refactor update

  public updateMessage() {
    const message: Message = {
      id: this.message.id,
      channel: this.message.channel,
      text: this.message.text,
      time: this.message.time,
      sender: this.message.sender,
      avatar: this.message.avatar,
      creationDate: this.message.creationDate,
      timeStamp: this.message.timeStamp
    }
    this.firestoreService.updateMessage('messages', message);
  }

  public updateReplyToMessageInThread() {
    const updateThread = this.firestoreService.threads.filter(thread => thread.message.timeStamp === this.message.timeStamp);

    updateThread.forEach(updateThread => {
      const thread: Thread = {
        id: updateThread.id,
        channel: updateThread.channel,
        text: updateThread.text,
        time: updateThread.time,
        sender: updateThread.sender,
        avatar: updateThread.avatar,
        creationDate: updateThread.creationDate,
        timeStamp: updateThread.timeStamp,
        message: this.message
      }
      this.firestoreService.updateThread('threads', thread)
    })
  }

  public updateThread() {
    const thread: Thread = {
      id: this.message.id,
      channel: this.message.channel,
      text: this.message.text,
      time: this.message.time,
      sender: this.message.sender,
      avatar: this.message.avatar,
      creationDate: this.message.creationDate,
      timeStamp: this.message.timeStamp,
      message: this.message.message
    }
    this.firestoreService.updateThread('threads', thread);
  }

  public updateDirectMessage() {
    const directMessage: DirectMessage = {
      id: this.message.id,
      text: this.message.text,
      time: this.message.time,
      receiver: this.message.receiver,
      sender: this.message.sender,
      avatar: this.message.avatar,
      creationDate: this.message.creationDate,
      timeStamp: this.message.timeStamp
    }
    this.firestoreService.updateDirectMessage('direct-messages', directMessage);
  }
}
