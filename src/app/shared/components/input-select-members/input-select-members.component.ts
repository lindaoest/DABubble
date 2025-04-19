import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MembersBoxComponent } from '../members-box/members-box.component';
import { Member } from '../../../../models/member.class';
import { GlobalVariablesService } from '../../../core/services/global-variables/global-variables.service';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';

@Component({
  selector: 'app-input-select-members',
  standalone: true,
  imports: [
    CommonModule,
    MembersBoxComponent
  ],
  templateUrl: './input-select-members.component.html',
  styleUrl: './input-select-members.component.scss'
})
export class InputSelectMembersComponent {

  @Input()
  public alreadyExistingMembers: Member[] = [];

  @Output()
  public membersEvent = new EventEmitter;

  public members: Member[] = [];
  public allMembersForMembersBox: Member[] = [];
  public numberOfParticipants!: number;
  public selectedMembers: Member[] = [];
  public showMembersBox: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) { }

  ngOnInit() {
    this.members = this.firestoreService.members.filter((member: Member) => member.member !== this.globalVariables.signed_in_member.displayName);
    this.numberOfParticipants = this.members.length
    this.allMembersForMembersBox = this.members;

    if (this.alreadyExistingMembers.length > 0) {
      this.allMembersForMembersBox = this.allMembersForMembersBox.filter(member =>
        !this.alreadyExistingMembers.some(existingMember => existingMember.email === member.email)
      );
      this.members = this.allMembersForMembersBox;
    }
  }

  public addNewMember(m: Member) {
    this.selectedMembers.push(m);
    this.emitMembers();
  }

  public deleteMember(i: number) {
    this.selectedMembers.splice(i, 1);
    this.emitMembers();
  }

  public emitMembers() {
    this.membersEvent.emit(this.selectedMembers);
  }

  public searchMember(val: any) {
    const inputValue = val.target.value;
    let searchMembers = [];

    if(inputValue.length == 1) {
      this.showMembersBox = true;
    }

    for(let searchMember of this.members) {
      const memberToLowerCase = searchMember.member.toLowerCase();

      if(memberToLowerCase.includes(inputValue.toLowerCase())) {
        searchMembers.push(searchMember);
      }
    }

    this.allMembersForMembersBox = searchMembers;
    searchMembers = [];
  }
}
