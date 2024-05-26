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
  members: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelComponent>, public dialog: MatDialog,  public channelFirestore: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogChannelAddMembersComponent, {
        data: { name: this.name, description: this.description, members: this.members },
      });

      dialogRef.afterClosed().subscribe(result => {
        const newChannel = new Channel({
          name: result.name,
          description: result.description,
          members: result.members
        })
        this.channelFirestore.addData(newChannel);
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
