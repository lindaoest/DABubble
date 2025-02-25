import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { GlobalVariablesService } from '../services/global-variables/global-variables.service';
import { getAuth, signOut } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../services/firestore/firestore.service';
import { UserStatusService } from '../services/user-status/user-status.service';
import { ProfileComponent } from '../components/overlays/profile/profile.component';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { Member } from '../../../models/member.class';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  //Subscription
  private channelSubscription: Subscription = new Subscription;
  public channels: Channel[] = [];

  public isHomePath: boolean = false;
  public lightboxIsOpen: boolean = false;
  public path!: string;
  public searchItems: any = [];
  public inputValue: any;

  constructor(
    private location: Location,
    private router: Router,
    public dialog: MatDialog,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
    public userStatusService: UserStatusService,
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.path = this.location.path();
      this.isHomePath = this.router.url == '/' || this.router.url.startsWith('/channels') || this.router.url.startsWith('/users');
    });

    this.channelSubscription = this.firestoreService.channels$.subscribe(channels => {
      this.channels = channels;
    });
  }

  public openLightbox() {
    this.lightboxIsOpen = !this.lightboxIsOpen;
  }

  public logOut() {
    const auth = getAuth();

    signOut(auth).then(() => {
      this.router.navigate(['log-in']);
      this.lightboxIsOpen = false;
    }).catch((error) => {
      console.error('logOut', error);
    });
  }

  public openProfile() {
    this.dialog.open(ProfileComponent, {
      data: {
        name: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        email: this.globalVariables.signed_in_member.email
      }
    });
    this.lightboxIsOpen = false;
  }

  public searchDevspace(val: any) {
    this.inputValue = val.target.value;

    this.searchItems = [];
    let searchChannels: Channel[] = [];
    let searchMembers: Member[] = [];

    if (this.inputValue != '') {
      for(let channel of this.channels) {
        const channelToLowerCase = channel.name.toLowerCase();

        if(channelToLowerCase.includes(this.inputValue.toLowerCase())) {
          searchChannels.push(channel);
        }
      }

      for(let member of this.firestoreService.members) {
        const memberToLowerCase = member.member.toLowerCase();

        if(memberToLowerCase.includes(this.inputValue.toLowerCase())) {
          searchMembers.push(member);
        }
      }

      if (searchChannels.length > 0) this.searchItems.push({'channels': searchChannels});
      if (searchMembers.length > 0) this.searchItems.push({'members': searchMembers});

      searchChannels = [];
      searchMembers = [];
    }
  }

  public openChat(channelName: string) {
    this.globalVariables.showDirectChat = false;
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showChat = true;
    this.globalVariables.activeChat = channelName;

    this.setActiveChannel(channelName);

    this.inputValue = '';

    // this.mobileClickedChat.emit();
  }

  public setActiveChannel(channelName: string) {
    this.firestoreService.channels$.subscribe(channels => {
      const foundChannelName = channels.find((obj: Channel) => obj.name === channelName);
      if (foundChannelName) {
        this.globalVariables.activeChannel = foundChannelName;
      } else {
        console.error('Channel not found');
      }
    });
  }

  public showDirectChat(receiver: string) {
    this.globalVariables.create_new_chat = false;
    this.globalVariables.showDirectChat = true;
    localStorage.setItem('active privatechat', JSON.stringify(receiver));

    let get_active_chat = localStorage.getItem('active privatechat');

    if (get_active_chat) {
      this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
    }

    this.inputValue = '';

    // this.mobileClickedDirectChat.emit();
  }
}
