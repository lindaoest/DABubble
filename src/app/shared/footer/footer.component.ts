import { Component } from '@angular/core';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, ImprintComponent, PrivacyComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(public router: Router) { }

  setRoute() {
    sessionStorage.setItem('urlLink', this.router.url);
  }
}
