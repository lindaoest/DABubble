import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

interface Member {
  member: string,
  email: string,
  url?: string
}

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  allMembers: Boolean = false;
  certainMember_Array: Member[] = [];

  private activeChatSubject = new Subject<string>();
  activeChat$: Observable<string> = this.activeChatSubject.asObservable();


  set activeChat(value: string) {
    this.activeChatSubject.next(value);
  }

}
