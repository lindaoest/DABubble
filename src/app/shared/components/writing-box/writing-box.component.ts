import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables/global-variables.service';
import { Message } from '../../../../models/message.class';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { DirectMessage } from '../../../../models/direct-message.class';
import { Thread } from '../../../../models/thread.class';
import { Channel } from '../../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { MembersBoxComponent } from '../members-box/members-box.component';
import { Member } from '../../../../models/member.class';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'emoji-picker-element';

@Component({
  selector: 'app-writing-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MembersBoxComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './writing-box.component.html',
  styleUrl: './writing-box.component.scss'
})
export class WritingBoxComponent {

  @Input()
  public activeChannel!: Channel;

  @Input()
  public sendMessage!: string;

  @Input()
  public messageToReplyTo!: Message;

  @Input()
  public activeMember: any;

  @Input()
  public name!: string;

  @Input()
  public is_createNewChat_open: boolean = false;

  public description: string = '';
  public members: Member[] = [];
  public openMembersBox: boolean = false;
  public tagMemberInTextarea: boolean = false;
  public emojiPickerIsOpen: boolean = false;

  constructor(
    public globalVariables: GlobalVariablesService,
    public firestoreService: FirestoreService
  ) { }

  @HostListener('document:click', ['$event'])
  onClickOutside() {
    this.openMembersBox = false;
    this.emojiPickerIsOpen = false;
    console.log('test');

  }

  public async addMessage() {
    if (this.sendMessage == 'message') {
      const message: Message = new Message({
        channel: this.activeChannel.name,
        text: this.description,
        time: this.globalVariables.currentTime(),
        sender: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })
      this.firestoreService.addMessage(message);

    } else if (this.sendMessage == 'direct_message') {
      const direct_message: DirectMessage = new DirectMessage({
        sender: this.globalVariables.signed_in_member.displayName,
        receiver: this.activeMember[0].member,
        text: this.description,
        time: this.globalVariables.currentTime(),
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })
      this.firestoreService.addDirectMessage(direct_message);

    } else if (this.sendMessage == 'thread') {
      const thread: Thread = new Thread({
        channel: this.activeChannel.name,
        text: this.description,
        time: this.globalVariables.currentTime(),
        sender: this.globalVariables.signed_in_member.displayName,
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime(),
        message: this.messageToReplyTo
      })
      this.firestoreService.addThread(thread);
    } else if (this.sendMessage == 'create_new_message') {
      const create_new_message: DirectMessage = new DirectMessage({
        sender: this.globalVariables.signed_in_member.displayName,
        receiver: this.name.substring(1),
        text: this.description,
        time: this.globalVariables.currentTime(),
        avatar: this.globalVariables.signed_in_member.photoURL,
        creationDate: new Date().toISOString().slice(0, 10),
        timeStamp: new Date().getTime()
      })

      await this.firestoreService.addDirectMessage(create_new_message);
    }

    this.description = '';

    if (this.is_createNewChat_open) {
      this.globalVariables.create_new_chat = false;
      this.globalVariables.showDirectChat = true;
      localStorage.setItem('active privatechat', JSON.stringify(this.name.substring(1)));

      let get_active_chat = localStorage.getItem('active privatechat');

      if (get_active_chat) {
        this.globalVariables.active_privatechat = JSON.parse(get_active_chat);
      }
    }
  }

  public tagMember(e: Event) {
    e.stopPropagation();
    this.members = [];

    for(let member of this.firestoreService.members) {
      this.members.push(member);
    }

    this.openMembersBox = true;
  }

  public addNewMember(m: Member) {
    if(this.tagMemberInTextarea) {
      this.description += `${m.member}`;
      this.tagMemberInTextarea = false;
    } else {
      this.description += `@${m.member}`;
    }

    this.openMembersBox = false;
  }

  public closeMembersBox() {
    this.openMembersBox = false;
  }

  public checkTagMember(e: any) {
    if(e.keyCode == 18) {
      this.tagMemberInTextarea = true;
      this.tagMember(e);
    }
  }

  public openEmojiPicker(e: Event) {
    e.stopPropagation();
    this.emojiPickerIsOpen = true;
  }

  public addEmoji(emoji: any) {
    this.description += emoji;

    console.log('emoji', this.description);
  }
}
