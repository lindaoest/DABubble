import { Component, OnInit } from '@angular/core';
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
    member: '',
    email: '',
    password: '',
    avatar: ''
  }

  registration_form: FormGroup = new FormGroup({});

  constructor(public router: Router, private globalVariables: GlobalVariablesService) { }

  privacyChecked: boolean = false;
  disableButton: Boolean = true;

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

  checkFields() {
    this.disableButton = (
      !this.data.member ||
      !this.data.email ||
      !this.data.password ||
      !this.privacyChecked
    )
  }

  onSubmit() {
    if (this.registration_form.valid) {
      this.globalVariables.newMember.push(this.registration_form.value);
      this.router.navigate(['choose-avatar']);
      console.log(this.globalVariables.newMember);
    }
  }
}
