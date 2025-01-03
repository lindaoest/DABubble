import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss'
})
export class AuthContainerComponent {

  @Input()
  public title!: string;

  @Input()
  public text!: string;

  @Input()
  public isBackLink: boolean = false;

  @Input()
  public backLink!: string;
}
