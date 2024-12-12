import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { GlobalVariablesService } from '../../shared/services/global-variables/global-variables.service';
import { Subscription, tap } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { privateConfig } from '../../app.config-private';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../models/message.class';
import { CreateNewChatComponent } from './create-new-chat/create-new-chat.component';
import { WritingBoxComponent } from '../../shared/components/writing-box/writing-box.component';
import { DateBlockMessageComponent } from '../../shared/components/date-block-message/date-block-message.component';
import { TopBarComponent } from '../../shared/components/top-bars/top-bar/top-bar.component';
import { TopBarContainerComponent } from '../../shared/components/top-bars/top-bar-container/top-bar-container.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    CreateNewChatComponent,
    DateBlockMessageComponent,
    FormsModule,
    TopBarComponent,
    TopBarContainerComponent,
    WritingBoxComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Output()
  public currentMessage = new EventEmitter();

  @Output()
  public mobileClickedThread = new EventEmitter();

  public name!: string;

  // Authentification firebase
  private firebaseConfig = privateConfig;
  private app = initializeApp(this.firebaseConfig);
  private auth = getAuth(this.app);

  // Subscription channels
  channelSubscription: Subscription = new Subscription;
  channels: Channel[] = [];

  constructor(
    public dialog: MatDialog,
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService,
  ) { }

  ngOnInit() {
    this.channelSubscription = this.firestoreService.channels$.pipe(
      tap((channels: Channel[]) => {
        this.channels = channels;
      })
    ).subscribe()

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.globalVariables.signed_in_member = user;
      }
    });
  }

  ngOnDestroy() {
    this.channelSubscription.unsubscribe();
  }

  /**
   * Starts a thread by emitting the selected message and triggers the mobile thread click event.
   * @param  message - Message
   * @returns - void
   */
  public start_thread(message: Message) {
    this.currentMessage.emit(message);
    this.mobileClickedThread.emit();
  }
}
