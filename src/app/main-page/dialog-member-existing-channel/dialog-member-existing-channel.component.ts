import { Component, Inject, Input } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { MembersBoxComponent } from '../../shared/components/members-box/members-box.component';

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
    CommonModule,
    MembersBoxComponent
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
  notIncludedMembers: Member[] = [];
  already_added_members: Member[] = [];

  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogMemberExistingChannelComponent>, public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
    });
  }

  ngOnInit() {
    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  ngOnDestroy() {
    if (this.certainMember_Array_Subsription) {
      this.certainMember_Array_Subsription.unsubscribe();
    }
  }

  showMemberBox() {
    this.firestoreService.channels$.subscribe(channels => {
      const foundChannel: any = channels.find((obj: any) => obj.name === this.globalVariables.activeChannel.name);
      channels.forEach((element: any) => {
        if (foundChannel) {
          if (foundChannel.name === element.name) {
            element.members.forEach((member: any) => {
              this.already_added_members.push(member);
            })
          }
        }
      })
    });

    this.notIncludedMembers = this.firestoreService.members.filter(member =>
      !this.already_added_members.some(added_member => added_member.member === member.member)
    );
  }

  // openDialog(): void {
  //   this.dialogRef.close();

  //   const dialogRefMember = this.dialog.open(DialogChannelAddMembersComponent, {
  //     data: { name: '', description: '', members: '' },
  //   });

  //   dialogRefMember.afterClosed().subscribe(result => {
  //     if (this.globalVariables.allMembers) {
  //       const newChannel = new Channel({
  //         id: result.id,
  //         name: result.name,
  //         description: result.description,
  //         members: this.firestoreService.members
  //       })
  //       this.firestoreService.addData(newChannel);
  //     } else {
  //       const newChannel = new Channel({
  //         id: result.id,
  //         name: result.name,
  //         description: result.description,
  //         members: this.globalVariables.certainMember_Array
  //       })
  //       this.firestoreService.addData(newChannel);

  //       this.globalVariables.certainMember_Array = [];
  //     }
  //   });
  // }

  onNoClick(): void {
    this.dialogRef.close();
    this.globalVariables.certainMember_Array = [];
  }

  // addMember(m: Member) {
  //   this.add_new_members_array.push(m);

  //   this.checkMemberArray();
  // }

  deleteMember(i: number) {
    this.selectedMember.splice(i, 1);
    if(this.selectedMember.length == 0) {
      this.checkMemberArray(true);
    }
  }

  checkMemberArray(memberLength: Boolean) {
    this.newMemberTrue = memberLength;
  }

  addToChannel() {
    this.selectedMember.forEach(element => {
      this.firestoreService.updateArray('channels', this.globalVariables.activeChannel.id, element)
    })
    this.globalVariables.certainMember_Array = [];
    this.dialogRef.close();
  }
}
