import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Message } from '../../../../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  public activeChannel!: Channel;
  public create_new_chat: boolean = false;
  public signed_in_member!: any;
  public verifyText: boolean = false;

  public showMenu: boolean = true;
  public showChat: boolean = false;
  public showDirectMessagesChat: boolean = false;
  public showThreads: boolean = false;

  private active_privatechatSubject = new BehaviorSubject<string>('null');
  public active_privatechat$: Observable<string> = this.active_privatechatSubject.asObservable();

  private activeChatSubject = new Subject<string>();
  public activeChat$: Observable<string> = this.activeChatSubject.asObservable();

  set activeChat(value: string) {
    this.activeChatSubject.next(value);
  }

  set active_privatechat(value: string) {
    this.active_privatechatSubject.next(value);
  }

  public currentTime() {
    let date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
