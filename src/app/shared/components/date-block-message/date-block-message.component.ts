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

  @Input()
  public dateGroup!: any;

  @Input()
  public messageToReplyTo!: Message;

  @Input()
  public isThreadMessage: boolean = false;

  @Input()
  public IsChatMessage: boolean = false;

  @Output()
  public currentMessage = new EventEmitter();

  public currentMessage_for_thread(message: Message) {
    this.currentMessage.emit(message);
  }
}
