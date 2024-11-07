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

  newMember!: Member;
  signed_in_member!: any;
  activeChannel: Channel = {
    id: '',
    name: '',
    members: [],
    description: '',
    creator: ''
  };
  messages: Message[] = [];
  create_new_chat: boolean = false;
  verifyText: boolean = false;
  personObjArray: Member[] = [];
  channelWithLoggedInUser!: Channel;

  showMenu: boolean = true;
  showChat: boolean = false;
  showDirectChat: boolean = false;
  showThreads: boolean = false;

  private active_privatechatSubject = new BehaviorSubject<string>('null');
  active_privatechat$: Observable<string> = this.active_privatechatSubject.asObservable();

  private activeChatSubject = new Subject<string>();
  activeChat$: Observable<string> = this.activeChatSubject.asObservable();

  private certainMember_Array_Subject = new BehaviorSubject<Member[]>([]);
  certainMember_Array$ = this.certainMember_Array_Subject.asObservable();

  set activeChat(value: string) {
    this.activeChatSubject.next(value);
  }

  set active_privatechat(value: string) {
    this.active_privatechatSubject.next(value);
  }

  set certainMember_Array(value: any[]) {
    this.certainMember_Array_Subject.next(value);
  }

  constructor() {
    const newMemberData = sessionStorage.getItem('new Member');
    if (newMemberData) {
      this.newMember = JSON.parse(newMemberData);
    }
  }

  currentTime() {
    let date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
