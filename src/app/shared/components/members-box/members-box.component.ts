import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-box',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './members-box.component.html',
  styleUrl: './members-box.component.scss'
})
export class MembersBoxComponent {

  // TODO kann weg
  @Output()
  public checkMemberLength = new EventEmitter();

  @Input()
  public selectedMembers: Member[] = [];

  @Output()
  public newMember = new EventEmitter;

  // memberArray: Member[] = [];
  // newMemberTrue: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) { }

  public selectMemberList() {
    if(this.selectedMembers.length > 0) {
      return this.selectedMembers;
    } else {
      return this.firestoreService.members;
    }
  }

  public addMember(m: Member) {
    const currentMember = this.firestoreService.members.find(member => member.member === m.member);

    if(currentMember) {
      this.newMember.emit(currentMember);

      // TODO Check ob es das noch braucht
      // this.memberArray.push(currentMember);
    }
    // this.setCertainMemberArray();
  }

  // setCertainMemberArray() {
  //   this.globalVariables.certainMember_Array = this.memberArray;
  // }

  // checkMemberArray() {
  //   this.memberArray.length > 0 ? this.newMemberTrue = false : this.newMemberTrue = true;
  //   this.checkMemberLength.emit(this.newMemberTrue);
  // }
}
