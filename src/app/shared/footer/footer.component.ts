import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterLinksComponent } from './footer-links/footer-links.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    FooterLinksComponent,
    RouterModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
