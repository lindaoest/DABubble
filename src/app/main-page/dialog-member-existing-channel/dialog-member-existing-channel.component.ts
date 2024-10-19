import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel.class';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
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
  newMemberTrue: boolean = true;
  notIncludedMembers: Member[] = [];
  already_added_members: Member[] = [];

  //Subscription
  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor( public dialogRef: MatDialogRef<DialogMemberExistingChannelComponent>, public dialog: MatDialog, public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService, @Inject(MAT_DIALOG_DATA) public data: DialogData ) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
    });

    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  ngOnDestroy() {
    this.certainMember_Array_Subsription.unsubscribe();
  }

  showMemberBox() {
    this.firestoreService.channels$.subscribe(channels => {
      const foundChannel: any = channels.find((obj: Channel) => obj.name === this.globalVariables.activeChannel.name);
      if (foundChannel) {
        channels.forEach((element: Channel) => {
          if (foundChannel.name === element.name) {
            element.members.forEach((member: Member) => {
              this.already_added_members.push(member);
            })
          }
        })
      }
    });

    this.notIncludedMembers = this.firestoreService.members.filter(member =>
      !this.already_added_members.some(added_member => added_member.member === member.member)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.globalVariables.certainMember_Array = [];
  }

  deleteMember(i: number) {
    this.selectedMember.splice(i, 1);
    if(this.selectedMember.length == 0) {
      this.checkMemberArray(true);
    }
  }

  checkMemberArray(memberLength: boolean) {
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
