import { Component, Input } from '@angular/core';
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { Message } from '../../../../../models/message.class';

@Component({
  selector: 'app-top-bar-thread',
  standalone: true,
  imports: [],
  templateUrl: './top-bar-thread.component.html',
  styleUrl: './top-bar-thread.component.scss'
})
export class TopBarThreadComponent {

  @Input()
  public messageToReplyTo!: Message;

  constructor(
    public globalVariables: GlobalVariablesService
  ) { }

  public close_thread() {
    this.globalVariables.showThreads = false;
    this.globalVariables.showChat = true;
  }
}
