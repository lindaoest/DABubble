import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { MembersBoxComponent } from "../../shared/components/members-box/members-box.component";
import { Subscription } from 'rxjs';
import { Member } from '../../../models/member.class';

export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-channel-add-members',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose,
    CommonModule,
    MembersBoxComponent
  ],
  templateUrl: './dialog-channel-add-members.component.html',
  styleUrl: './dialog-channel-add-members.component.scss'
})
export class DialogChannelAddMembersComponent {

  allMembers: boolean = false;
  certainMembers: boolean = false;
  memberisChecked: boolean = false;
  isClicked: boolean = false;
  newMemberTrue: boolean = true;
  members: Member[] = [];
  notIncludedMembers: Member[] = [];

  //Subscription
  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor( public dialogRefMember: MatDialogRef<DialogChannelAddMembersComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
    });
  }

  ngOnInit() {
    const creatorMember = this.firestoreService.members.filter((obj: any) => obj.member !== this.globalVariables.signed_in_member.displayName);
    this.notIncludedMembers.push(...creatorMember);
  }

  ngOnDestroy() {
    this.certainMember_Array_Subsription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRefMember.close();
  }

  checkAllMembers() {
    this.allMembers = !this.allMembers;
    this.globalVariables.certainMember_Array = [];
    this.globalVariables.certainMember_Array = this.firestoreService.members;
    this.certainMembers = false;
    this.checkMemberArray(false);
  }

  checkCertainMembers() {
    this.certainMembers = !this.certainMembers;
    this.globalVariables.certainMember_Array = [];
    this.allMembers = false;
    this.checkMemberArray(true);
  }

  checkMemberArray(memberLength: boolean) {
    this.newMemberTrue = memberLength;
  }

  deleteMember(i: number) {
    this.selectedMember.splice(i, 1);
    if(this.selectedMember.length == 0) {
      this.checkMemberArray(true);
    }
  }
}
