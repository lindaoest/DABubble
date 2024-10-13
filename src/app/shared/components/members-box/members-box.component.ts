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

  isClicked: Boolean = false;
  memberArray: any[] = [];
  newMemberTrue: Boolean = false;

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  addMember(m: Member) {
    const foundName = this.channelFirestore.members.find(obj => obj.member === m.member);
    this.memberArray.push(foundName)
    // console.log('membersArray', this.memberArray)
    this.setCertainMemberArray();
    this.isClicked = true;
    this.checkMemberArray();
  }

  setCertainMemberArray() {
    this.globalVariables.certainMember_Array = this.memberArray;
  }

  // deleteMember(i: number) {
  //   this.memberArray.splice(i, 1);
  //   this.setCertainMemberArray();
  //   this.checkMemberArray();
  // }

  checkMemberArray() {
    if (this.memberArray.length > 0) {
      this.newMemberTrue = false;
    } else {
      this.newMemberTrue = true;
    }
    this.checkMemberLength.emit(this.newMemberTrue);
  }
}
