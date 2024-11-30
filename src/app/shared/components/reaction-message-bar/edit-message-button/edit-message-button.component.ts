import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-message-button',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './edit-message-button.component.html',
  styleUrl: './edit-message-button.component.scss'
})
export class EditMessageButtonComponent {

  @Input()
  public boxEditMessageIsOpen: boolean = false;
}
