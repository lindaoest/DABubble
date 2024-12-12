import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { OverviewChannelItemComponent } from './overview-channel-item/overview-channel-item.component';

@Component({
  selector: 'app-dialog-overview-channel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverviewChannelItemComponent
  ],
  templateUrl: './dialog-overview-channel.component.html',
  styleUrl: './dialog-overview-channel.component.scss'
})
export class DialogOverviewChannelComponent {

  constructor(
    private dialogRef: MatDialogRef<DialogOverviewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Channel
  ) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
