import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ImprintComponent } from './shared/footer/imprint/imprint.component';
import { PrivacyComponent } from './shared/footer/privacy/privacy.component';
import { DirectmessagesChatComponent } from './main-page/chat/directmessages-chat/directmessages-chat.component';
import { ChatComponent } from './main-page/chat/chat.component';
import { AuthGuard } from './core/guards/authenticated-guard.guard';

export const routes: Routes = [
	{ path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users/:id',
        component: DirectmessagesChatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'channels/:id',
        component: ChatComponent,
        canActivate: [AuthGuard],
      }
    ],
   },
	{ path: 'log-in', component: LogInComponent },
	{ path: 'sign-in', component: RegistrationComponent },
	{ path: 'choose-avatar', component: ChooseAvatarComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'new-password', component: NewPasswordComponent },
	{ path: 'imprint', component: ImprintComponent },
	{ path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: '/log-in' }
];
