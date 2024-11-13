import { Component } from '@angular/core';
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { DialogMemberExistingChannelComponent } from '../../overlays/dialog-member-existing-channel/dialog-member-existing-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { DialogOverviewChannelComponent } from '../../overlays/dialog-overview-channel/dialog-overview-channel.component';
import { Subscription } from 'rxjs';

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

  //Subscription
  private activeChatSubscription: Subscription = new Subscription;
  public activeChat!: string;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activeChatSubscription = this.globalVariables.activeChat$.subscribe(chat => {
      this.activeChat = chat;
    });
  }

  ngOnDestroy() {
    this.activeChatSubscription.unsubscribe();
  }

  /**
   * Opens a dialog for the active channel and ensures the active chat is set.
   * Subscribes to `channels$` from `firestoreService`, searches for the active chat within the channels,
   * sets the active channel in `globalVariables`, and opens a dialog to display the channel data.
   * @returns void
   */
  public openDialogChannel(): void {
    if (this.globalVariables.activeChannel) {
      this.firestoreService.channels$.subscribe((channels: any) => {
        if (!this.activeChat) {
          this.activeChat = channels[0].name;
        }
        const foundChannel = channels.find((obj: any) => obj.name === this.activeChat);
        if (foundChannel) {
          this.globalVariables.activeChannel = foundChannel;
        } else {
          console.warn('Channel not found');
        }
      });
      this.dialog.open(DialogOverviewChannelComponent, {
        data: this.globalVariables.activeChannel
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
