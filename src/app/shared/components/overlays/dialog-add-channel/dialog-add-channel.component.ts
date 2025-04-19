import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../../../models/channel.class';
import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { DialogChannelAddMembersComponent } from '../dialog-channel-add-members/dialog-channel-add-members.component';
import { GlobalVariablesService } from '../../../../core/services/global-variables/global-variables.service';
import { Member } from '../../../../../models/member.class';

export interface DialogData {
  name: string;
  description: string;
  members: []
}

@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  public name!: string;
  public description: string = '';
  public disableButton: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogAddChannelComponent>,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) { }

  public openDialog(): void {
    this.dialogRef.close();

    const dialogRefMember = this.dialog.open(DialogChannelAddMembersComponent, {
      data: { name: this.name, description: this.description, members: [] },
    });

    this.afterAddingMembers(dialogRefMember);
  }

  public afterAddingMembers(dialogRefMember: any) {

    dialogRefMember.afterClosed().subscribe((result: Channel) => {
      const creatorMember = this.firestoreService.members.find((member: Member) => member.member === this.globalVariables.signed_in_member.displayName);

      if (creatorMember) {
        result.members.push(creatorMember);
      }

      const newChannel: Channel = {
        id: result.id,
        name: result.name,
        description: result.description,
        members: result.members,
        creator: this.globalVariables.signed_in_member.displayName
      }
      this.firestoreService.addChannel(newChannel);
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public checkFields() {
    this.disableButton = !this.name;
  }
}
