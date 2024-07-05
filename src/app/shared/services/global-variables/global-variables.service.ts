import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Channel } from '../../../../models/channel.class';

interface Member {
  member: string,
  email: string,
  password: string,
  avatar: string
}

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

}
