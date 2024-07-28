import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Messenges } from '../../../../models/messenges.class';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  allMembers: Boolean = false;
  certainMember_Array: Member[] = [];
  newMember: Member = {
    member: '',
    email: '',
    password: '',
    avatar: ''
  };
  signed_in_member!: any;
  activeChannel: Channel = {
    id: '',
    name: '',
    members: [],
    description: '',
    creator: ''
  };
  messenges: Messenges[] = [];
  create_new_chat: Boolean = false;
  open_directmessages_chat: Boolean = false;
  active_privatechat: string = '';

  private activeChatSubject = new Subject<string>();
  activeChat$: Observable<string> = this.activeChatSubject.asObservable();


  set activeChat(value: string) {
    this.activeChatSubject.next(value);
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
