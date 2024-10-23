import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  showFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.checkUrl();
    });
  }

  checkUrl() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('log-in') || currentUrl.includes('sign-in') || currentUrl.includes('choose-avatar')) {
      this.showFooter = true;
    } else {
      this.showFooter = false;
    }
  }
}
