import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Messenges } from '../../../../models/messenges.class';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input() message!: Messenges;
  @Output()currentMessage = new EventEmitter();

  constructor(public globalVariables: GlobalVariablesService) { }

  start_thread(message: Messenges) {
    this.globalVariables.open_thread_reply = true;
    this.currentMessage.emit(message);
  }
}
