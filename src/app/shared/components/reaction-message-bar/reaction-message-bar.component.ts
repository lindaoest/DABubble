import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  public messageIsEditable: boolean = false;

  @Output()
  public editableMessage = new EventEmitter();

  @Output()
  public openThread = new EventEmitter();

  public boxEditMessageIsOpen: boolean = false;

  public openBoxEditMessage() {
    this.boxEditMessageIsOpen = !this.boxEditMessageIsOpen;
  }

  public editMessage() {
    this.editableMessage.emit();

    this.boxEditMessageIsOpen = false;
  }

  public openThreadMessages() {
    this.openThread.emit();
  }
}
