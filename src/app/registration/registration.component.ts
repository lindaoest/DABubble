import { Component } from '@angular/core';
import { Member } from '../../models/member.class';
import { FormsModule } from '@angular/forms';

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

  privacyChecked: boolean = false;
  disableButton: Boolean = true;

  onPrivacyChange() {
    this.disableButton = !this.disableButton;
    console.log(this.disableButton)
  }

  onSubmit() {
    console.log(this.data)
  }
}
