import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Member } from '../../../../models/member.class';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-box.component.html',
  styleUrl: './members-box.component.scss'
})
export class MembersBoxComponent {

  isClicked: Boolean = false;
  memberArray: any[] = [];

  constructor(public channelFirestore: FirestoreService, public globalVariables: GlobalVariablesService) { }

  addMember(m: Member) {
    const foundName = this.channelFirestore.members.find(obj => obj.member === m.member);
    this.memberArray.push(foundName)
    console.log('membersArray', this.memberArray)
    this.globalVariables.certainMember_Array = this.memberArray;
    this.isClicked = true;
  }
}
