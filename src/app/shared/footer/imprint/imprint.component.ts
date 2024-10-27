import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

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
