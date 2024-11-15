import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EditMessageButtonComponent } from './edit-message-button/edit-message-button.component';

@Component({
  selector: 'app-reaction-message-bar',
  standalone: true,
  imports: [
    CommonModule,
    EditMessageButtonComponent
  ],
  templateUrl: './reaction-message-bar.component.html',
  styleUrl: './reaction-message-bar.component.scss'
})
export class ReactionMessageBarComponent {

  @Input()
  public messageEditable: boolean = false;

  public openedEditMessage: boolean = false;

  openEditMessage() {
    this.openedEditMessage = !this.openedEditMessage;
  }
}
