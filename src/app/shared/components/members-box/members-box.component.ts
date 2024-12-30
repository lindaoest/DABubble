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

  @Input()
  public selectedMembers: Member[] = [];

  @Output()
  public newMember = new EventEmitter;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) { }

  public addMember(m: Member) {
    const currentMember = this.firestoreService.members.find(member => member.member === m.member);

    if(currentMember) {
      this.newMember.emit(currentMember);
    }
  }
}
