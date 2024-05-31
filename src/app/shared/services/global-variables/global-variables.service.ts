import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Member {
  member: string,
  email: string,
  url?: string
}

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  allMembers:Boolean = false;
  certainMember_Array: Member[] = [];
  activeChat: string = '';

}
