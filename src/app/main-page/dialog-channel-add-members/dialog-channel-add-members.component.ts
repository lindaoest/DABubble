import { Component, Inject, Output, EventEmitter } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';

interface Member {
  member: string,
  email: string,
  url?: string
}
export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-channel-add-members',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose
  ],
  templateUrl: './dialog-channel-add-members.component.html',
  styleUrl: './dialog-channel-add-members.component.scss'
})
export class DialogChannelAddMembersComponent {

  allMembers: Boolean = false;
  certainMembers: Boolean = false;
  members: any[] = [];

  //certainMember_Array: Member[] = [];

  constructor(
    public dialogRefMember: MatDialogRef<DialogChannelAddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {}

  onNoClick(): void {
    this.dialogRefMember.close();
  }

  checkAllMembers() {
    this.allMembers = !this.allMembers;
    this.globalVariables.allMembers = this.allMembers;
  }

  checkCertainMembers() {
    this.certainMembers = !this.certainMembers;
  }

  addMember(m:Member) {
    const foundName = this.channelFirestore.members.find(obj => obj.member === m.member);
    this.globalVariables.certainMember_Array.push(foundName);
    console.log('certaimMember_array', this.globalVariables.certainMember_Array)
  }
}
