import { Component, Inject, Output, EventEmitter } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';

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

  certainMember_Array: [] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogChannelAddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {
      console.log('channelFirestore', this.channelFirestore.members)
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkAllMembers() {
    this.allMembers = !this.allMembers;
    this.globalVariables.allMembers = this.allMembers;
  }

  checkCertainMembers() {
    this.certainMembers = !this.certainMembers;
  }

  addMember() {
    
  }
}
