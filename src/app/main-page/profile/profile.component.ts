import { Component } from '@angular/core';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(public dialogRef: MatDialogRef<ProfileComponent>, public dialog: MatDialog, public globalVariables: GlobalVariablesService) {}

  editProfile() {
    this.dialogRef.close();

    const dialogRefMember = this.dialog.open(EditProfileComponent, {});

    dialogRefMember.afterClosed().subscribe(result => {
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
