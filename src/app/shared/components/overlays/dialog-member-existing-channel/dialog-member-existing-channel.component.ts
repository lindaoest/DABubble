import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../../../models/channel.class';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { Member } from '../../../../../models/member.class';
import { InputSelectMembersComponent } from '../../input-select-members/input-select-members.component';

@Component({
  selector: 'app-dialog-member-existing-channel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputSelectMembersComponent
  ],
  templateUrl: './dialog-member-existing-channel.component.html',
  styleUrl: './dialog-member-existing-channel.component.scss'
})
export class DialogMemberExistingChannelComponent {

  public alreadyAddedMembers: Member[] = [];
  public disabledButton: boolean = true;
  public members!: Member[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogMemberExistingChannelComponent>,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) { }

  ngOnInit() {
    this.showMemberBox();
  }

  public showMemberBox() {
    this.firestoreService.channels$.subscribe(channels => {
      const foundChannel = channels.find((channel: Channel) => channel.name === this.globalVariables.activeChannel.name);

      if(foundChannel) {
        foundChannel.members.forEach((member: Member) => {
          this.alreadyAddedMembers.push(member);
        })
      }
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public checkMemberLength(m: Member[]) {
    this.members = m;

    if (m.length > 0) {
      this.disabledButton = false;
    } else {
      this.disabledButton = true;
    }
  }

  public addToChannel() {
    this.members.forEach(member => {
      this.firestoreService.updateArray('channels', this.globalVariables.activeChannel.id, member)
    })
    this.dialogRef.close();
  }
}
