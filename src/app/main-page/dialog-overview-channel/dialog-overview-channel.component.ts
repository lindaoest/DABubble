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

export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-overview-channel',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose
  ],
  templateUrl: './dialog-overview-channel.component.html',
  styleUrl: './dialog-overview-channel.component.scss'
})
export class DialogOverviewChannelComponent {

  name: string = '';
  description: string = '';

  editModus: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewChannelComponent>, public dialog: MatDialog, public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.setModel();
    }

  setModel() {
    if(this.data.name) {
      this.name = this.data.name;
      this.description = this.data.description;
    } else {
      this.name = this.channelFirestore.channels[0].name;
      this.description = this.channelFirestore.channels[0].description;
    }

    console.log('name', this.channelFirestore.channels[0].name)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editChannel() {
    this.editModus = true;
  }

  saveChanges() {
    this.channelFirestore.updateData('channels', this.data);
    this.editModus = false;
  }
}
