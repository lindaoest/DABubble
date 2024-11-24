import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';
import { ReactionMessageBarComponent } from '../reaction-message-bar/reaction-message-bar.component';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { Thread } from '../../../../models/thread.class';

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
  public message!: Message;

  @Input()
  public isThreadMessage: boolean = false;

  @Input()
  public IsChatMessage: boolean = false;

  @Output()
  public currentMessage = new EventEmitter();

  messageIsEditable: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) { }

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
    this.updateMessage();
    this.updateThread();

    this.messageIsEditable = false;
  }

  updateMessage() {
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

  updateThread() {
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
}
