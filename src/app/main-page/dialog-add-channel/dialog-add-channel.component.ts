import { Component, Inject } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { Member } from '../../../models/member.class';

export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose
  ],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  name: string = '';
  description: string = '';
  members: [] = [];
  disableButton: Boolean = true;
  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelComponent>, public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
        this.selectedMember = member;
      });
    }

  ngOnDestroy() {
    if (this.certainMember_Array_Subsription) {
      this.certainMember_Array_Subsription.unsubscribe();
    }
  }

  openDialog(): void {
    this.dialogRef.close();

    const dialogRefMember = this.dialog.open(DialogChannelAddMembersComponent, {
      data: { name: this.name, description: this.description, members: this.members },
    });

    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
    });

    dialogRefMember.afterClosed().subscribe(result => {
      const creatorMember = this.firestoreService.members.find((obj: any) => obj.member === this.globalVariables.signed_in_member.displayName);
      const alreadyExistMember = this.selectedMember.some(m => m.member === creatorMember.member);
      if(!alreadyExistMember) {
        this.selectedMember.push(creatorMember);
      }

      const newChannel = new Channel({
        id: result.id,
        name: result.name,
        description: result.description,
        members: this.selectedMember,
        creator: this.globalVariables.signed_in_member.displayName
      })
      this.firestoreService.addData(newChannel);
      this.globalVariables.certainMember_Array = [];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkFields() {
    this.disableButton = !this.name;
  }
}
