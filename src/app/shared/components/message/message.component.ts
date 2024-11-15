import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';
import { ReactionMessageBarComponent } from '../reaction-message-bar/reaction-message-bar.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactionMessageBarComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input()
  public message!: Message;

  @Input()
  public threadMessage: boolean = false;

  @Input()
  public chatMessage: boolean = false;

  @Output()
  public currentMessage = new EventEmitter();

  constructor(
    public globalVariables: GlobalVariablesService
  ) { }

  public start_thread(message: Message) {
    this.globalVariables.showThreads = true;
    this.currentMessage.emit(message);
  }
}
