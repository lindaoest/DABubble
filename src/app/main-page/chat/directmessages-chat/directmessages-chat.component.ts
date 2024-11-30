import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WritingBoxComponent } from "../../../shared/components/writing-box/writing-box.component";
import { DateBlockMessageComponent } from '../../../shared/components/date-block-message/date-block-message.component';
import { TopBarContainerComponent } from '../../../shared/components/top-bars/top-bar-container/top-bar-container.component';
import { TopBarDirectMessageComponent } from '../../../shared/components/top-bars/top-bar-direct-message/top-bar-direct-message.component';
import { Member } from '../../../../models/member.class';

@Component({
  selector: 'app-directmessages-chat',
  standalone: true,
  imports: [
    CommonModule,
    DateBlockMessageComponent,
    FormsModule,
    TopBarContainerComponent,
    TopBarDirectMessageComponent,
    WritingBoxComponent,
  ],
  templateUrl: './directmessages-chat.component.html',
  styleUrl: './directmessages-chat.component.scss'
})
export class DirectmessagesChatComponent {

  public activeMember!: Member[];

  //Subscription
  private active_privatechatSubscription: Subscription = new Subscription;

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.active_privatechatSubscription = this.globalVariables.active_privatechat$.subscribe(subscriber => {
      this.activeMember = this.firestoreService.members.filter(member => member.member === subscriber);
    });
  }

  ngOnDestroy() {
    if(this.active_privatechatSubscription) {
      this.active_privatechatSubscription.unsubscribe();
    }
  }

  public isRelevantGroup(key: string): boolean {
    const signedInMember = this.globalVariables.signed_in_member.displayName;
    const participants = [signedInMember, this.activeMember[0].member].sort().join('-');
    return key === participants;
  }
}
