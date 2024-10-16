import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables/global-variables.service';
import { MembersBoxComponent } from '../../../shared/components/members-box/members-box.component';
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
  open_member_box: boolean = false;

  //Subscription
  certainMember_Array_Subsription: Subscription = new Subscription;

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.certainMember_Array_Subsription = this.globalVariables.certainMember_Array$.subscribe(member => {
      if (member.length > 0) {
        this.addMemberToInput(member[0].member);
      }
    });
  }

  ngOnDestroy() {
    this.certainMember_Array_Subsription.unsubscribe();
  }

  /**
   * Observes the input in `name` and checks if it contains an '@' symbol.
   * If found, sets `open_member_box` to `true`, otherwise sets it to `false`.
   */
  observe_input() {
    this.name.includes('@') ? this.open_member_box = true : this.open_member_box = false;
  }

  /**
   * Adds a member to the input by setting `name` to the given member string prefixed with '@'.
   * Closes the member box by setting `open_member_box` to `false`.
   *
   * @param {string} m - The member to add to the input.
   */
  addMemberToInput(m: string) {
    this.name = '@' + m;
    this.open_member_box = false;
  }
}
