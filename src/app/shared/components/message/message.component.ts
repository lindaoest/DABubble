import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input() message!: Message;
  @Input() threadMessage: boolean = false;
  @Input() chatMessage: boolean = false;
  @Output()currentMessage = new EventEmitter();

  constructor(public globalVariables: GlobalVariablesService) { }

  start_thread(message: Message) {
    this.globalVariables.showThreads = true;
    this.currentMessage.emit(message);
  }
}
