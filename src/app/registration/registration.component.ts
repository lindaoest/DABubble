import { Component } from '@angular/core';
import { Member } from '../../models/member.class';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  data: Member = {
    id: '',
    member: '',
    email: '',
    password: '',
    avatar: ''
  }
  privacyChecked: boolean = false;
  disableButton: boolean = true;

  registration_form: FormGroup = new FormGroup({});

  constructor(public router: Router, private globalVariables: GlobalVariablesService) { }

  ngOnInit() {
    this.registration_form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      privacyChecked: new FormControl('', Validators.required),
    });
  }

  onPrivacyChange() {
    this.privacyChecked = !this.privacyChecked;
  }

  onSubmit() {
    if (this.registration_form.valid) {
      this.router.navigate(['choose-avatar']);
      sessionStorage.setItem('new Member', JSON.stringify(this.registration_form.value));
      const newMemberData = sessionStorage.getItem('new Member');
      if (newMemberData) {
        this.globalVariables.newMember = JSON.parse(newMemberData);
      }
    }
  }
}
