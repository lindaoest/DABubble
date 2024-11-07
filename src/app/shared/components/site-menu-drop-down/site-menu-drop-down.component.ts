import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogAddChannelComponent } from '../overlays/dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Member } from '../../../../models/member.class';

@Component({
  selector: 'app-site-menu-drop-down',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './site-menu-drop-down.component.html',
  styleUrl: './site-menu-drop-down.component.scss'
})
export class SiteMenuDropDownComponent {

  @Input() open_accordeon: boolean = false;
  @Input() rightIcon: boolean = false;
  @Input() title!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() members!: Member[];
  @Input() icon!: string;

  constructor(
    public dialog: MatDialog
  ) { }


  open_accordeon_items() {
    this.open_accordeon = !this.open_accordeon;
  }

  openDialogAddChannel(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members },
    });
  }
}
