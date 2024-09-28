import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
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

  allMembers: Boolean = false;
  certainMembers: Boolean = false;
  memberisChecked: Boolean = false;
  members: any[] = [];
  isClicked: Boolean = false;
  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor(
    public dialogRefMember: MatDialogRef<DialogChannelAddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
    });
  }

  ngOnDestroy() {
    if (this.certainMember_Array_Subsription) {
      this.certainMember_Array_Subsription.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRefMember.close();
  }

  checkAllMembers() {
    this.allMembers = !this.allMembers;
    this.globalVariables.allMembers = this.allMembers;
    this.certainMembers = false;
  }

  checkCertainMembers() {
    this.certainMembers = !this.certainMembers;
    this.allMembers = false;
  }

  deleteMember(i: number) {
    this.selectedMember.splice(i, 1);
  }
}
