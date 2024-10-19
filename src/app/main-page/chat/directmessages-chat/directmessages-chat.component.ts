import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../../profile/profile.component';
import { Subscription } from 'rxjs';
import { WritingBoxComponent } from "../../../shared/components/writing-box/writing-box.component";
import { DateBlockMessageComponent } from '../../../shared/components/date-block-message/date-block-message.component';

@Component({
  selector: 'app-directmessages-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, WritingBoxComponent, DateBlockMessageComponent],
  templateUrl: './directmessages-chat.component.html',
  styleUrl: './directmessages-chat.component.scss'
})
export class DirectmessagesChatComponent {

  activeMember: any;

  //Subscription
  active_privatechatSubscription: Subscription = new Subscription;

  constructor(public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService, public dialog: MatDialog,) { }

  ngOnInit() {
    this.active_privatechatSubscription = this.globalVariables.active_privatechat$.subscribe(subscriber => {
      this.activeMember = this.firestoreService.members.filter(member => member.member === subscriber);
      console.log('subscriber', subscriber)
    });
  }

  ngOnDestroy() {
    if(this.active_privatechatSubscription) {
      this.active_privatechatSubscription.unsubscribe();
    }
  }

  /**
   * Opens a dialog with the `ProfileComponent` and passes the data of the active member.
   *
   * @function openDialog
   * @memberof YourComponent
   * @returns {void}
   */
  openDialog() {
    this.dialog.open(ProfileComponent, {
      data: {
        name: this.activeMember[0].member,
        avatar: this.activeMember[0].avatar,
        email: this.activeMember[0].email
      }
    });
  }

  /**
   * Checks if the provided group key corresponds to a group that includes the signed-in member and the active member.
   *
   * @function isRelevantGroup
   * @memberof YourComponent
   * @param {string} key - The group key to check.
   * @returns {boolean} - Returns true if the key matches the participants, false otherwise.
   */
  isRelevantGroup(key: string): boolean {
    const signedInMember = this.globalVariables.signed_in_member.displayName;
    const participants = [signedInMember, this.activeMember[0].member].sort().join('-');
    return key === participants;
  }

  /**
   * Tracking function for *ngFor, used to optimize rendering by returning a unique identifier for each item.
   *
   * @function trackByFn
   * @memberof YourComponent
   * @param {number} index - The index of the item in the array.
   * @returns {number} - The index of the item.
   */
  trackByFn(index: number): number {
    return index;
  }
}
