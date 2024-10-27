import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

  url!: string;

  ngOnInit(): void {
    this.getRoute();
  }

  getRoute() {
    const backUrl = sessionStorage.getItem('urlLink');

    if (backUrl) {
      this.url = backUrl;
    }
  }
}
