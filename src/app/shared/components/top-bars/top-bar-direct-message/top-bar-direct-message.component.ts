import { Component } from '@angular/core';
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { ProfileComponent } from '../../overlays/profile/profile.component';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { Member } from '../../../../../models/member.class';

@Component({
  selector: 'app-top-bar-direct-message',
  standalone: true,
  imports: [],
  templateUrl: './top-bar-direct-message.component.html',
  styleUrl: './top-bar-direct-message.component.scss'
})
export class TopBarDirectMessageComponent {

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

  public closeDirectMessageMobile() {
    this.globalVariables.showMenu = true;
    this.globalVariables.showDirectChat = false;
  }

  public openDialog() {
    this.dialog.open(ProfileComponent, {
      data: {
        name: this.activeMember[0].member,
        avatar: this.activeMember[0].avatar,
        email: this.activeMember[0].email
      }
    });
  }
}
