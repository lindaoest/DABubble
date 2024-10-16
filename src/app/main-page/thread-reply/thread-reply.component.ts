import { Component, Input } from '@angular/core';
import { Messenges } from '../../../models/messenges.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';
import { WritingBoxComponent } from "../../shared/components/writing-box/writing-box.component";
import { DateBlockMessageComponent } from '../../shared/components/date-block-message/date-block-message.component';
import { MessageComponent } from '../../shared/components/message/message.component';

@Component({
  selector: 'app-thread-reply',
  standalone: true,
  imports: [CommonModule, FormsModule, WritingBoxComponent, DateBlockMessageComponent, MessageComponent],
  templateUrl: './thread-reply.component.html',
  styleUrl: './thread-reply.component.scss'
})
export class ThreadReplyComponent {

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

  close_thread() {
    this.globalVariables.open_thread_reply = false;
  }

}
