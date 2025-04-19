import { Component, Input } from '@angular/core';
import { GlobalVariablesService } from '../../../../core/services/global-variables/global-variables.service';
import { DialogMemberExistingChannelComponent } from '../../overlays/dialog-member-existing-channel/dialog-member-existing-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../../core/services/firestore/firestore.service';
import { DialogOverviewChannelComponent } from '../../overlays/dialog-overview-channel/dialog-overview-channel.component';
import { Subscription } from 'rxjs';
import { Channel } from '../../../../../models/channel.class';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  @Input()
  public activeChannel!: Channel;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
    public dialog: MatDialog
  ) { }

  public openDialogChannel(): void {
    if (this.activeChannel) {
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.activeChannel
      });
    }
  }

  /**
   * Retrieves the list of members from the active channel.
   * @function getMembers
   * @returns any - An array of members from the active channel.
   */
  public getMembers() {
    return this.globalVariables.activeChannel.members;
  }

  /**
   * Opens a dialog to add members to the active channel.
   * @returns void
   */
  public addMembers() {
    this.dialog.open(DialogMemberExistingChannelComponent, {
      data: this.globalVariables.activeChannel
    });
  }

  public closeChatMobile() {
    this.globalVariables.showMenu = true;
    this.globalVariables.showChat = false;
  }
}
