import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { GlobalVariablesService } from '../../../../../core/services/global-variables/global-variables.service';
import { Channel } from '../../../../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../../core/services/firestore/firestore.service';
import { Router } from '@angular/router';
import { Message } from '../../../../../../models/message.class';
import { Thread } from '../../../../../../models/thread.class';

@Component({
  selector: 'app-overview-channel-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './overview-channel-item.component.html',
  styleUrl: './overview-channel-item.component.scss'
})
export class OverviewChannelItemComponent {

  @Input()
  public data!: Channel;

  @Input()
  public key!: string;

  @Input()
  public isEditable: boolean = false;

  @Input()
  public text!: string;

  @Input()
  public title!: string;

  @ContentChild('createdBy')
  public createdBy!: TemplateRef<any>;

  constructor(
    public globalVariables: GlobalVariablesService,
    public firestoreService: FirestoreService,
    public router: Router
  ) { }

  public editChannel() {
    this.isEditable = true;
  }

  public saveChannel() {
    switch (this.key) {
      case 'name':
        this.updateMessageFunction(this.text);
        this.updateThreadFunction(this.text);
        this.data.name = this.text;
        this.changeRouterLink();
        break;
      case 'description':
        this.data.description = this.text;
        break;
      default:
        break;
    }
    this.firestoreService.updateChannel('channels', this.data);
    this.isEditable = false;
    this.globalVariables.activeChat = this.data.name;
  }

  public changeRouterLink() {
    this.router.navigate(['/channels', this.data.name.toLowerCase()]);
  }

  public updateMessageFunction(name: string) {
    const updateMessages = this.firestoreService.messages.filter(message => message.channel === this.data.name);

    updateMessages.forEach(updateMessage => {
      const message: Message = {
        id: updateMessage.id,
        channel: name,
        text: updateMessage.text,
        time: updateMessage.time,
        sender: updateMessage.sender,
        avatar: updateMessage.avatar,
        creationDate: updateMessage.creationDate,
        timeStamp: updateMessage.timeStamp
      }
      this.firestoreService.updateMessage('messages', message)
    })
  }

  public updateThreadFunction(name: string) {
    const updateThread = this.firestoreService.threads.filter(thread => thread.channel === this.data.name);

    updateThread.forEach(updateThread => {
      const thread: Thread = {
        id: updateThread.id,
        channel: name,
        text: updateThread.text,
        time: updateThread.time,
        sender: updateThread.sender,
        avatar: updateThread.avatar,
        creationDate: updateThread.creationDate,
        timeStamp: updateThread.timeStamp,
        message: this.updateMessageInThread(updateThread.message, name)
      }
      this.firestoreService.updateThread('threads', thread)
    })
  }

  public updateMessageInThread(message: Message, name: string): Message {
    const thread: Message = {
      id: message.id,
      channel: name,
      text: message.text,
      time: message.time,
      sender: message.sender,
      avatar: message.avatar,
      creationDate: message.creationDate,
      timeStamp: message.timeStamp
    }
    return thread;
  }
}
