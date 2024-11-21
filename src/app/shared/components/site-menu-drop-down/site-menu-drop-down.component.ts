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

  @Input()
  public description!: string;

  @Input()
  public icon!: string;

  @Input()
  public members!: Member[];

  @Input()
  public name!: string;

  @Input()
  public open_accordion: boolean = false;

  @Input()
  public openDialog: boolean = false;

  @Input()
  public rightIcon: boolean = false;

  @Input()
  public title!: string;

  constructor(
    public dialog: MatDialog
  ) { }


  public open_accordeon_items() {
    this.open_accordion = !this.open_accordion;
  }

  public openDialogAddChannel(): void {
    this.dialog.open(DialogAddChannelComponent, {
      data: { name: this.name, description: this.description, members: this.members },
    });
  }
}
