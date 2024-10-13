import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Messenges } from '../../../../models/messenges.class';

@Component({
  selector: 'app-date-block-message',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './date-block-message.component.html',
  styleUrl: './date-block-message.component.scss'
})
export class DateBlockMessageComponent {

  @Input() dateGroup!: any;
  @Output() currentMessage = new EventEmitter();

  ngOnInit() {
    console.log('dateGroup', this.dateGroup);

  }

  currentMessage_for_thread(message: Messenges) {
    this.currentMessage.emit(message);
  }
}
