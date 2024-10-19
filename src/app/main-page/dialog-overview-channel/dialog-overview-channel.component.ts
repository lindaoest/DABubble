import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Channel } from '../../../models/channel.class';

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

  editModus: boolean = false;

  constructor( public dialogRef: MatDialogRef<DialogOverviewChannelComponent>, public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService, @Inject(MAT_DIALOG_DATA) public data: Channel ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editChannel() {
    this.editModus = true;
  }

  saveChanges() {
    this.firestoreService.updateData('channels', this.data);
    this.editModus = false;
    this.globalVariables.activeChat = this.data.name;
  }
}
