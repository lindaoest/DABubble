import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-box.component.html',
  styleUrl: './members-box.component.scss'
})
export class MembersBoxComponent {

  @Output() checkMemberLength = new EventEmitter();
  @Input() notIncludedMembers: Member[] = [];

  isClicked: boolean = false;
  memberArray: Member[] = [];
  newMemberTrue: boolean = false;

  constructor(public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) { }

  addMember(m: Member) {
    const foundName = this.firestoreService.members.find(obj => obj.member === m.member);

    if(foundName) {
      this.memberArray.push(foundName);
    }
    this.isClicked = true;
    this.setCertainMemberArray();
    this.checkMemberArray();
  }

  setCertainMemberArray() {
    this.globalVariables.certainMember_Array = this.memberArray;
  }

  checkMemberArray() {
    this.memberArray.length > 0 ? this.newMemberTrue = false : this.newMemberTrue = true;
    this.checkMemberLength.emit(this.newMemberTrue);
  }
}
