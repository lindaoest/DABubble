import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MembersBoxComponent } from '../members-box/members-box.component';
import { Member } from '../../../../models/member.class';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { FirestoreService } from '../../services/firestore/firestore.service';

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

  public members!: Member[];
  public selectedMembers: Member[] = [];

  @Output()
  public membersEvent = new EventEmitter;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) { }

  ngOnInit() {
    const allMembersWithoutCurrentMember = this.firestoreService.members.filter((member: Member) => member.member !== this.globalVariables.signed_in_member.displayName);
    this.members = allMembersWithoutCurrentMember;

    console.log('alreadyExistingMembers', this.alreadyExistingMembers);

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
}
