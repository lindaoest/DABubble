import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EditMessageButtonComponent } from './edit-message-button/edit-message-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'emoji-picker-element';
import { FirestoreService } from '../../../core/services/firestore/firestore.service';
import { Emoji } from 'emoji-picker-element/shared';

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
  public customEmojis: any[] = [];
  public defaultEmojis: string[] = ['👍', '✅', '🙏'];

  constructor(
    public firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    console.log('test', this.firestoreService.emojis);

    if (this.firestoreService.emojis.length === 0) {
      this.defaultEmojis.forEach(defaultEmoji => {
        this.firestoreService.addEmojiShortcuts(defaultEmoji);
      })
    }

    this.firestoreService.emojis.forEach(emoji => {
      this.customEmojis.push(emoji.emoji);
    })
  }

  public openEmojiPicker() {
    this.emojiPickerIsOpen = true;
  }

  public addEmojiToShortcuts(emoji: any) {
    this.emojiPickerIsOpen = false;

    this.firestoreService.deleteEmoji('emojis', this.customEmojis[2]);

    this.firestoreService.addEmojiShortcuts(emoji);
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
