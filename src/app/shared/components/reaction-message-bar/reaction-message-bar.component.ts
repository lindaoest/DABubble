import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EditMessageButtonComponent } from './edit-message-button/edit-message-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'emoji-picker-element';

@Component({
  selector: 'app-reaction-message-bar',
  standalone: true,
  imports: [
    CommonModule,
    EditMessageButtonComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
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
  public emojiPickerIsOpen: boolean = false;
  public customEmojis = [ "🔥", "🚀", "👍"];

  public openEmojiPicker() {
    this.emojiPickerIsOpen = true;
  }

  public addEmojiToShortcuts(emoji: any) {
    this.customEmojis.unshift(emoji);
    this.customEmojis.pop();

    this.emojiPickerIsOpen = false;
  }

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

  public onUnhover() {
    this.emojiPickerIsOpen = false;
  }
}
