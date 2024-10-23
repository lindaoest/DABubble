import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../../../models/message.class';
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
  @Input() messageToReplyTo!: Message;
  @Input() threadMessage: boolean = false;
  @Input() chatMessage: boolean = false;
  @Output() currentMessage = new EventEmitter();

  currentMessage_for_thread(message: Message) {
    this.currentMessage.emit(message);
  }
}
