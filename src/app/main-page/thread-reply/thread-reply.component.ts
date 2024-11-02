import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';
import { WritingBoxComponent } from "../../shared/components/writing-box/writing-box.component";
import { DateBlockMessageComponent } from '../../shared/components/date-block-message/date-block-message.component';
import { MessageComponent } from '../../shared/components/message/message.component';
import { Thread } from '../../../models/thread.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread-reply',
  standalone: true,
  imports: [CommonModule, FormsModule, WritingBoxComponent, DateBlockMessageComponent, MessageComponent],
  templateUrl: './thread-reply.component.html',
  styleUrl: './thread-reply.component.scss'
})
export class ThreadReplyComponent {

  @Input() messageToReplyTo: Message = {
    channel: '',
    text: '',
    time: '',
    sender: '',
    avatar: '',
    creationDate: 0,
    timeStamp: 0
  };

  answerLength: number = 0;

  //Subscription
  private activeChatSubscription: Subscription = new Subscription;
  activeChat: string = '';

  constructor(public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });
  }

  ngOnChanges() {
    this.answerTextLength();
  }

  ngOnDestroy() {
    this.activeChatSubscription.unsubscribe();
  }

  answerTextLength() {
    this.answerLength = 0;

    this.firestoreService.threads.forEach((thread: Thread) => {
      const message: any = thread.message;

      if(message.timeStamp === this.messageToReplyTo.timeStamp) {
        this.answerLength += 1;
      }
    })
  }

  close_thread() {
    this.globalVariables.showThreads = false;
    this.globalVariables.showChat = true;
  }
}
