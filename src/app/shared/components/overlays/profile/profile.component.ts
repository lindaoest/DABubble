import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GlobalVariablesService } from '../../../../core/services/global-variables/global-variables.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export interface DialogData {
  name: string;
  avatar: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProfileComponent>,
    public globalVariables: GlobalVariablesService,
  ) { }

  public editProfile() {
    this.dialogRef.close();
    const dialogRefMember = this.dialog.open(EditProfileComponent, {});
    dialogRefMember.afterClosed().subscribe();
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
