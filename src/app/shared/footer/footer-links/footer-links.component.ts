import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-links',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './footer-links.component.html',
  styleUrl: './footer-links.component.scss'
})
export class FooterLinksComponent {

  @Input()
  public link!: string;
}
