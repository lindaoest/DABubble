import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';

export const routes: Routes = [
	{ path: '', component: MainPageComponent },
	{ path: 'log-in', component: LogInComponent },
	{ path: 'sign-in', component: RegistrationComponent },
	{ path: 'choose-avatar', component: ChooseAvatarComponent },
];
