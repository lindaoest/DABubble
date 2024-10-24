import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { DirectMessage } from '../../../../models/direct-message.class';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { MembersBoxComponent } from '../../../shared/components/members-box/members-box.component';
import { Member } from '../../../../models/member.class';
import { WritingBoxComponent } from '../../../shared/components/writing-box/writing-box.component';

@Component({
  selector: 'app-create-new-chat',
  standalone: true,
  imports: [FormsModule, MembersBoxComponent, WritingBoxComponent],
  templateUrl: './create-new-chat.component.html',
  styleUrl: './create-new-chat.component.scss'
})
export class CreateNewChatComponent {

  placeholder_value: string = "An: @jemand";
  name: string = '';
  message_to_direct_message: boolean = false;
  certainMember_Array_Subsription: Subscription = new Subscription;
  selectedMember: Member[] = [];

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      this.selectedMember = member;
      if(this.selectedMember.length > 0) {
        this.addMemberToInput(this.selectedMember[0].member);
      }
    });
  }

  ngOnDestroy() {
    if (this.certainMember_Array_Subsription) {
      this.certainMember_Array_Subsription.unsubscribe();
    }
  }

  observe_input() {
    if (this.name.includes('@')) {
      this.message_to_direct_message = true;
    } else {
      this.message_to_direct_message = false;
    }
  }

  addMemberToInput(m: string) {
    this.name = '@' + m;
    this.message_to_direct_message = false;
  }
}
