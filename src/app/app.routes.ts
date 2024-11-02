import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ImprintComponent } from './shared/footer/imprint/imprint.component';
import { PrivacyComponent } from './shared/footer/privacy/privacy.component';

export const routes: Routes = [
	{ path: 'home', component: MainPageComponent },
	{ path: 'log-in', component: LogInComponent },
	{ path: 'sign-in', component: RegistrationComponent },
	{ path: 'choose-avatar', component: ChooseAvatarComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'new-password', component: NewPasswordComponent },
	{ path: 'imprint', component: ImprintComponent },
	{ path: 'privacy', component: PrivacyComponent },
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },  // Redirect to log-in for standard
  { path: '**', redirectTo: '/log-in' }
];
