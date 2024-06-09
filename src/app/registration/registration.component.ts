import { Component } from '@angular/core';
import { Member } from '../../models/member.class';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChooseAvatarComponent } from '../choose-avatar/choose-avatar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  data: Member = {
    member: '',
    email: '',
    password: '',
    avatar: ''
  }

  constructor(public router: Router, private globalVariables: GlobalVariablesService) {}

  privacyChecked: boolean = false;
  disableButton: Boolean = true;

  onPrivacyChange() {
    this.privacyChecked = !this.privacyChecked;
  }

  checkFields() {
    this.disableButton = (
      !this.data.member ||
      !this.data.email ||
      !this.data.password ||
      !this.privacyChecked
    )
  }

  onSubmit() {
    this.globalVariables.newMember.push(this.data);
    this.router.navigate(['choose-avatar']);
    console.log(this.globalVariables.newMember);
  }
}
