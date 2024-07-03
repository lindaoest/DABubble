import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { DialogChannelAddMembersComponent } from '../dialog-channel-add-members/dialog-channel-add-members.component';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Member } from '../../../models/member.class';

export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-member-existing-channel',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose,
    CommonModule
  ],
  templateUrl: './dialog-member-existing-channel.component.html',
  styleUrl: './dialog-member-existing-channel.component.scss'
})
export class DialogMemberExistingChannelComponent {

  add_new_members_array: Member[] = [];
  newMember: Member = {
    member: '',
    email: '',
    password: '',
    avatar: ''
  };
  newMemberTrue: Boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogMemberExistingChannelComponent>, public dialog: MatDialog, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  openDialog(): void {
    this.dialogRef.close();

    const dialogRefMember = this.dialog.open(DialogChannelAddMembersComponent, {
      data: { name: '', description: '', members: '' },
    });

    dialogRefMember.afterClosed().subscribe(result => {
      if (this.globalVariables.allMembers) {
        const newChannel = new Channel({
          id: result.id,
          name: result.name,
          description: result.description,
          members: this.channelFirestore.members
        })
        this.channelFirestore.addData(newChannel);
      } else {
        const newChannel = new Channel({
          id: result.id,
          name: result.name,
          description: result.description,
          members: this.globalVariables.certainMember_Array
        })
        this.channelFirestore.addData(newChannel);
        console.log(result);

        this.globalVariables.certainMember_Array = [];
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addMember(m:Member, i: number) {
    const foundName = this.channelFirestore.members.find(obj => obj.member === m.member);
    this.add_new_members_array.push(foundName);

    this.checkMemberArray();
  }

  deleteMember(i: number) {
    this.add_new_members_array.splice(i, 1);

    this.checkMemberArray();
  }

  checkMemberArray() {
    if(this.add_new_members_array.length > 0) {
      this.newMemberTrue = false;
    } else {
      this.newMemberTrue = true;
    }
  }

  addToChannel() {
  }
}
