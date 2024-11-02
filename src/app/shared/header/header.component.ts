import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { GlobalVariablesService } from '../services/global-variables/global-variables.service';
import { getAuth, signOut } from "firebase/auth";
import { ProfileComponent } from '../components/overlays/profile/profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  path: string = '';
  openLightboxVar: boolean = false;

  constructor(public dialog: MatDialog, private router: Router, private location: Location, public globalVariables: GlobalVariablesService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.path = this.location.path();
    });
  }

  openLightbox() {
    this.openLightboxVar = !this.openLightboxVar;
  }

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['log-in']);
      this.openLightboxVar = false;
    }).catch((error) => {
      console.log('logOut', error);
    });
  }

  openProfile(): void {
    this.dialog.open(ProfileComponent, {
      data: {
        name: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        email: this.globalVariables.signed_in_member.email
      }
    });
    this.openLightboxVar = false;
  }
}
