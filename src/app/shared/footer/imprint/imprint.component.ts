import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(
    public location: Location
  ) { }

  public goBack() {
    this.location.back();
  }
}
