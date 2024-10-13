import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Messenges } from '../../../../models/messenges.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-block-message',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './date-block-message.component.html',
  styleUrl: './date-block-message.component.scss'
})
export class DateBlockMessageComponent {

  @Input() dateGroup!: any;
  @Input() messageToReplyTo!: Messenges;
  @Input() threadMessage: Boolean = false;
  @Output() currentMessage = new EventEmitter();

  currentMessage_for_thread(message: Messenges) {
    this.currentMessage.emit(message);
  }
}
