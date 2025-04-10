import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, arrayUnion, DocumentData } from "firebase/firestore";
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Message } from '../../../../models/message.class';
import { DirectMessage } from '../../../../models/direct-message.class';
import { FirestoreHelperService } from '../firestoreHelper/firestore-helper.service';
import { Thread } from '../../../../models/thread.class';

interface Emoji {
  id: string;
  emoji: any; // Replace `any` with a more specific type if possible
};

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  members: Member[] = [];
  messages: Message[] = [];
  emojis: Emoji[] = [];
  // direct_messages: DirectMessage[] = [];
  threads: Thread[] = [];
  groupedMessages: { [channel: string]: { [date: string]: any[] } } = {};
  groupedDirectMessages: { [key: string]: any[] } = {};
  groupedThreads: { [channel: string]: { [date: string]: any[] } } = {};

  //Unsupscription
  unsubChannel: any;
  unsubMember: any;
  unsubMessage: any;
  unsubDirectMessage: any;
  unsubThread: any;
  unsubEmoji: any;

  //Subscription
  private channelSubject = new BehaviorSubject<Channel[]>([]);
  channels$ = this.channelSubject.asObservable();

  private directMessageSubject = new BehaviorSubject<DirectMessage[]>([]);
  directMessages$ = this.directMessageSubject.asObservable();

  set channels(value: Channel[]) {
    this.channelSubject.next(value);
  }

  set direct_messages(value: DirectMessage[]) {
    this.directMessageSubject.next(value);
  }

  constructor(
    public firestoreHelper: FirestoreHelperService,
    public firestore: Firestore
  ) {

    this.unsubChannel = onSnapshot(this.getDocRef('channels'), (doc) => {
      const tempChannels: Channel[] = [];

      doc.forEach(element => {
        tempChannels.push(this.setObjectChannel(element.data(), element.id));
      });
      this.channels = tempChannels;
    });

    this.unsubMember = onSnapshot(this.getDocRef('members'), (doc) => {
      this.members = [];
      doc.forEach(element => {
        this.members.push(this.setObjectMember(element.data(), element.id))
      });
    });

    this.unsubMessage = onSnapshot(this.getDocRef('messages'), (doc) => {
      this.messages = [];
      doc.forEach(element => {
        this.messages.push(this.setObjectMessage(element.data(), element.id))
      });
      this.groupedMessages = this.firestoreHelper.groupByDateAndChannel(this.messages);
    });

    this.unsubDirectMessage = onSnapshot(this.getDocRef('direct-messages'), (doc) => {
      const tempdirectMessages: DirectMessage[] = [];

      doc.forEach(element => {
        tempdirectMessages.push(this.setObjectDirectMessage(element.data(), element.id))
      });
      this.direct_messages = tempdirectMessages;
      this.groupedDirectMessages = this.firestoreHelper.groupDirectMessages(tempdirectMessages);
    });

    this.unsubThread = onSnapshot(this.getDocRef('threads'), (doc) => {
      this.threads = [];
      doc.forEach(element => {
        this.threads.push(this.setObjectThread(element.data(), element.id))
      });
      this.groupedThreads = this.firestoreHelper.groupByDateAndChannel(this.threads);
    });

    this.unsubEmoji = onSnapshot(this.getDocRef('emojis'), (doc) => {
      this.emojis = [];
      doc.forEach(element => {
        this.emojis.push(this.setEmojis(element.data(), element.id));
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubChannel();
    this.unsubMember();
    this.unsubMessage();
    this.unsubDirectMessage();
    this.unsubThread();
    this.unsubEmoji();
  }

  //Add Data
  async addChannel(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObjectChannel(data, ''));
  }

  async addMember(data: Member) {
    await addDoc(this.getDocRef('members'), this.setObjectMember(data, ''));
  }

  async addMessage(data: Message) {
    await addDoc(this.getDocRef('messages'), this.setObjectMessage(data, ''));
  }

  async addDirectMessage(data: DirectMessage) {
    await addDoc(this.getDocRef('direct-messages'), this.setObjectDirectMessage(data, ''));
  }

  async addThread(data: Thread) {
    await addDoc(this.getDocRef('threads'), this.setObjectThread(data, ''));
  }

  async addEmojiShortcuts(data: string) {
    await addDoc(this.getDocRef('emojis'), {emoji: data});
  }

  //Update data
  async updateChannel(colId: string, data: Channel) {
    if (data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForChannel(data));
    }
  }

  async updateMember(colId: string, data: Member) {
    if (data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForMember(data));
    }
  }

  async updateMessage(colId: string, data: Message) {
    if (data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForMessage(data));
    }
  }

  async updateDirectMessage(colId: string, data: DirectMessage) {
    if (data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForDirectMessage(data));
    }
  }

  async updateThread(colId: string, data: Thread) {
    if (data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForThread(data));
    }
  }

  async updateArray(colId: string, id: string, newKey: Member) {
    if (id) {
      await updateDoc(this.getSingleDocRef(colId, id), {
        members: arrayUnion(this.firestoreHelper.getCleanJsonForMember(newKey))
      });
    }
  }

  // async updateArrayMessages(colId: string, id: string, newKey: any) {
  //   if (id) {
  //     await updateDoc(this.getSingleDocRef(colId, id), {
  //       messages: arrayUnion(this.firestoreHelper.getCleanJsonForArray(newKey))
  //     });
  //   }
  // }

  //Set object
  setObjectChannel(obj: Channel | DocumentData, id: string): Channel {
    return {
      id: id,
      name: obj.name,
      description: obj.description,
      members: obj.members,
      creator: obj.creator
    }
  }

  setObjectMember(obj: Member | DocumentData, id: string): Member {
    return {
      id: id || obj.id || '',
      member: obj.member,
      email: obj.email,
      password: obj.password,
      avatar: obj.avatar,
      isOnline: obj.isOnline
    }
  }

  setObjectMessage(obj: Message | DocumentData, id: string): Message {
    return {
      id: id || '',
      channel: obj.channel,
      text: obj.text,
      time: obj.time,
      sender: obj.sender,
      avatar: obj.avatar,
      creationDate: obj.creationDate,
      timeStamp: obj.timeStamp
    }
  }

  setObjectDirectMessage(obj: DirectMessage | DocumentData, id: string): DirectMessage {
    return {
      id: id,
      sender: obj.sender,
      receiver: obj.receiver,
      text: obj.text,
      time: obj.time,
      avatar: obj.avatar,
      creationDate: obj.creationDate,
      timeStamp: obj.timeStamp
    }
  }

  // setObjectDirectMessage2(obj: any, id: string) {
  //   return {
  //     id: id,
  //     sender: obj.sender,
  //     receiver: obj.receiver,
  //     messages: this.firestoreHelper.allMessages(obj)
  //   }
  // }

  setObjectThread(obj: Thread | DocumentData, id: string): Thread {
    return {
      id: id || '',
      channel: obj.channel,
      text: obj.text,
      time: obj.time,
      sender: obj.sender,
      avatar: obj.avatar,
      creationDate: obj.creationDate,
      timeStamp: obj.timeStamp,
      message: this.setObjectMessage(obj.message, obj.message.id)
    }
  }

  setEmojis(obj: Emoji | DocumentData, id: string): Emoji {
    return {
      id: id || '',
      emoji : obj.emoji
    }
  }

  getDocRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
