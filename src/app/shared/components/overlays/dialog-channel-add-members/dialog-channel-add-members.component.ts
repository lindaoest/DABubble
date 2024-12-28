import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { Member } from '../../../../../models/member.class';
import { MatRadioModule } from '@angular/material/radio';
import { InputSelectMembersComponent } from '../../input-select-members/input-select-members.component';

export interface DialogData {
  name: string;
  description: string;
  members: Member[];
}

@Component({
  selector: 'app-dialog-channel-add-members',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose,
    CommonModule,
    MatRadioModule,
    InputSelectMembersComponent
  ],
  templateUrl: './dialog-channel-add-members.component.html',
  styleUrl: './dialog-channel-add-members.component.scss'
})
export class DialogChannelAddMembersComponent {

  public members: Member[] = [];
  public isCertainMembers: boolean = false;
  public disabledButton: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRefMember: MatDialogRef<DialogChannelAddMembersComponent>,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) { }

  onNoClick(): void {
    this.dialogRefMember.close();
  }

  public checkMembers(value: string) {
    if (value == "allMembers") {
      this.disabledButton = false;
      this.members = this.firestoreService.members;
      this.isCertainMembers = false;
    } else {
      this.disabledButton = true;
      this.isCertainMembers = true;
    }
  }

  public checkMemberLength(m: Member[]) {
    this.members = m;

    if (m.length > 0) {
      this.disabledButton = false;
    } else {
      this.disabledButton = true;
    }
  }

  public addMembers() {
    this.data.members = this.members;
  }
}
