import { Component } from '@angular/core';
import { Member } from '../../models/member.class';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { InputComponent } from '../form/input/input.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    AuthContainerComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  public form: FormGroup = new FormGroup({});
  public privacyChecked: boolean = false;

  constructor(
    public globalVariables: GlobalVariablesService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      member: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      privacyChecked: new FormControl('', Validators.required),
    });
  }

  public onPrivacyChange() {
    this.privacyChecked = !this.privacyChecked;
  }

  public onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['choose-avatar']);
      sessionStorage.setItem('new Member', JSON.stringify(this.form.value));
    }
  }
}
