import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { GlobalVariablesService } from '../../../../services/global-variables/global-variables.service';
import { Channel } from '../../../../../../models/channel.class';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore/firestore.service';

@Component({
  selector: 'app-overview-channel-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './overview-channel-item.component.html',
  styleUrl: './overview-channel-item.component.scss'
})
export class OverviewChannelItemComponent {

  @Input()
  public data!: Channel;

  @Input()
  public key!: string;

  @Input()
  public isEditable: boolean = false;

  @Input()
  public text!: string;

  @Input()
  public title!: string;

  @ContentChild('createdBy')
  public createdBy!: TemplateRef<any>;

  constructor(
    public globalVariables: GlobalVariablesService,
    public firestoreService: FirestoreService
  ) { }

  public editChannel() {
    this.isEditable = true;
  }

  public saveChannel() {
    switch (this.key) {
      case 'name':
        this.data.name = this.text;
        break;
      case 'description':
        this.data.description = this.text;
        break;
      default:
        break;
    }
    this.firestoreService.updateChannel('channels', this.data);
    this.isEditable = false;
    this.globalVariables.activeChat = this.data.name;
  }
}
