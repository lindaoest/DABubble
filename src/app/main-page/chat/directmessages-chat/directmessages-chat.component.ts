import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../../profile/profile.component';
import { DirectMessage } from '../../../../models/direct-message.class';
import { Subscription } from 'rxjs';
import { WritingBoxComponent } from "../../../shared/components/writing-box/writing-box.component";

@Component({
  selector: 'app-directmessages-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, WritingBoxComponent],
  templateUrl: './directmessages-chat.component.html',
  styleUrl: './directmessages-chat.component.scss'
})
export class DirectmessagesChatComponent {

  activeMember: any;
  active_privatechatSubscription: Subscription = new Subscription;

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService, public dialog: MatDialog,) { }

  ngOnInit() {
    this.active_privatechatSubscription = this.globalVariables.active_privatechat$.subscribe(subscriber => {
      this.activeMember = this.channelFirestore.members.filter(member => member.member === subscriber);
      console.log('subscriber', subscriber)
    });
  }

  ngOnDestroy() {
    if(this.active_privatechatSubscription) {
      this.active_privatechatSubscription.unsubscribe();
    }
  }

  openDialog() {
    this.dialog.open(ProfileComponent, {
      data: {
        name: this.activeMember[0].member,
        avatar: this.activeMember[0].avatar,
        email: this.activeMember[0].email
      }
    });
  }

  isRelevantGroup(key: string): boolean {
    const signedInMember = this.globalVariables.signed_in_member.displayName;
    const participants = [signedInMember, this.activeMember[0].member].sort().join('-');
    return key === participants;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
