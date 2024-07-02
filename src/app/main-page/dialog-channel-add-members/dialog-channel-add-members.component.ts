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
    MatDialogClose,
    CommonModule
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
    this.certainMembers = false;
  }

  checkCertainMembers() {
    this.certainMembers = !this.certainMembers;
    this.allMembers = false;
    console.log(this.channelFirestore.members)
  }

  addMember(m:Member, i: number) {
    const foundName = this.channelFirestore.members.find(obj => obj.member === m.member);
    this.globalVariables.certainMember_Array.push(foundName);
    console.log('certaimMember_array', this.globalVariables.certainMember_Array)
    this.isClicked = true;
  }

  deleteMember(i: number) {
    this.globalVariables.certainMember_Array.splice(i, 1);
    console.log('splitted', this.globalVariables.certainMember_Array)
    console.log('index', i)
  }
}
