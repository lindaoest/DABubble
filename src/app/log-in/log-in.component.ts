import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  email: string = '';
  password: string = '';

  constructor(public router: Router, public channelFirestore: FirestoreService) {}

  checkLogin() {
    const activeMember = this.channelFirestore.members.find(obj => obj.email === this.email && obj.password === this.password);

    if(activeMember) {
      this.router.navigate(['']);
    }
  }
}
