import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { EditMessageButtonComponent } from './edit-message-button/edit-message-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'emoji-picker-element';
import { FirestoreService } from '../../services/firestore/firestore.service';
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

  constructor(
    public firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.firestoreService.emojis.forEach(emoji => {
      this.customEmojis.push(emoji.emoji);
    })

    console.log("members", this.firestoreService.members);


    console.log('testt', this.firestoreService.emojis);
  }

  public openEmojiPicker() {
    this.emojiPickerIsOpen = true;
  }

  public addEmojiToShortcuts(emoji: any) {
    console.log(emoji);

    this.customEmojis.unshift(emoji);
    this.customEmojis.pop();

    this.emojiPickerIsOpen = false;

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
