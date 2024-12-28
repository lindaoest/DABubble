import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MembersBoxComponent } from '../../../shared/components/members-box/members-box.component';
import { WritingBoxComponent } from '../../../shared/components/writing-box/writing-box.component';
import { TopBarContainerComponent } from '../../../shared/components/top-bars/top-bar-container/top-bar-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-new-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MembersBoxComponent,
    TopBarContainerComponent,
    WritingBoxComponent,
  ],
  templateUrl: './create-new-chat.component.html',
  styleUrl: './create-new-chat.component.scss'
})
export class CreateNewChatComponent {

  public name!: string;
  public openMemberBox: boolean = false;
  public placeholder_value: string = "An: @jemand";

  public observe_input() {
    this.name.includes('@') ? this.openMemberBox = true : this.openMemberBox = false;
  }

  public addMemberToInput(m: any) {
    this.name = '@' + m.member;
    this.openMemberBox = false;
  }
}
