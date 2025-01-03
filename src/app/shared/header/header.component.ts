import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { GlobalVariablesService } from '../services/global-variables/global-variables.service';
import { getAuth, signOut } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../services/firestore/firestore.service';
import { UserStatusService } from '../services/user-status/user-status.service';
import { ProfileComponent } from '../components/overlays/profile/profile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  public isHomePath: boolean = false;
  public lightboxIsOpen: boolean = false;
  public path!: string;

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
  }

  public openLightbox() {
    this.lightboxIsOpen = !this.lightboxIsOpen;
  }

  public logOut() {
    const auth = getAuth();

    signOut(auth).then(() => {
      this.router.navigate(['log-in']);
      this.lightboxIsOpen = false;

      // Observe online-/offline-status
      this.userStatusService.initialize(this.globalVariables.signed_in_member.uid);
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
}
