import { Component, Input } from '@angular/core';
import { Messenges } from '../../../models/messenges.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';
import { Thread } from '../../../models/thread.class';
import { WritingBoxComponent } from "../../shared/components/writing-box/writing-box.component";

@Component({
  selector: 'app-thread-reply',
  standalone: true,
  imports: [CommonModule, FormsModule, WritingBoxComponent],
  templateUrl: './thread-reply.component.html',
  styleUrl: './thread-reply.component.scss'
})
export class ThreadReplyComponent {

  name: string = '';

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

  close_thread() {
    this.globalVariables.open_thread_reply = false;
  }

}
