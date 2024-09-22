import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Messenges } from '../../../../models/messenges.class';
import { DirectMessage } from '../../../../models/direct-message.class';
import { FirestoreHelperService } from '../firestoreHelper/firestore-helper.service';
import { Thread } from '../../../../models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  unsub: any;
  unsubMembers: any;
  unsubMessenges: any;
  unsubDirectMessage: any;
  unsubThreads: any;

  private channelSubject = new BehaviorSubject([]);
  channels$ = this.channelSubject.asObservable();

  set channels(value: any) {
    this.channelSubject.next(value);
  }

  // channels: Channel[] = [];
  members: any[] = [];
  messenges: any[] = [];
  direct_message: any[] = [];
  threads: any[] = [];
  groupedMessages: { [channel: string]: { [date: string]: any[] } } = {};
  groupedDirectMessages: { [key: string]: any[] } = {};
  groupedThreads: { [channel: string]: { [date: string]: any[] } } = {};

  constructor(public firestoreHelper: FirestoreHelperService) {
    this.unsub = onSnapshot(this.getDocRef('channels'), (doc) => {
        const tempChannels: any[] = [];  // Temporäres Array erstellen
      doc.forEach(element => {
          tempChannels.push(this.setObject(element.data(), element.id));
      });
      this.channels = tempChannels;  // Das Array über den Setter setzen
    });

    this.unsubMembers = onSnapshot(this.getDocRef('members'), (doc) => {
      this.members = [];
      doc.forEach(element => {
        this.members.push(this.setObjectMembers(element.data(), element.id))
      });
    });

    this.unsubMessenges = onSnapshot(this.getDocRef('messenges'), (doc) => {
      this.messenges = [];
      doc.forEach(element => {
        this.messenges.push(this.setObjectMessenges(element.data(), element.id))
      });
      this.groupedMessages = this.firestoreHelper.groupMessagesByDateAndChannel(this.messenges);
    });

    this.unsubDirectMessage = onSnapshot(this.getDocRef('direct-message'), (doc) => {
      this.direct_message = [];
      doc.forEach(element => {
        this.direct_message.push(this.setObjectDirectMessage(element.data(), element.id))
      });
      this.groupedDirectMessages = this.firestoreHelper.groupDirectMessages(this.direct_message);
      // console.log('direct-message', this.groupedDirectMessages)
    });

    this.unsubThreads = onSnapshot(this.getDocRef('threads'), (doc) => {
      this.threads = [];
      doc.forEach(element => {
        this.threads.push(this.setObjectThreads(element.data(), element.id))
      });
      this.groupedThreads = this.firestoreHelper.groupThreadsByDateAndChannel(this.threads);
    });
  }

  ngOnDestroy(): void {
    this.unsub();
    this.unsubMembers();
    this.unsubMessenges();
    this.unsubThreads();
  }

  setObject(obj: any, id: string) {
    return {
      id: id,
      name: obj.name,
      description: obj.description,
      members: obj.members,
      creator: obj.creator
    }
  }

  setObjectMembers(obj: any, id: string): Member {
    return {
      id: id || '',
      member: obj.member,
      email: obj.email,
      password: obj.password,
      avatar: obj.avatar
    }
  }

  setObjectMessenges(obj: any, id: string): Messenges {
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

  setObjectDirectMessage(obj: any, id: string) {
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

  setObjectDirectMessage2(obj: any, id: string) {
    return {
      id: id,
      sender: obj.sender,
      receiver: obj.receiver,
      messages: this.firestoreHelper.allMessages(obj)
    }
  }

  setObjectThreads(obj: any, id: string): Thread {
    return {
      id: id || '',
      channel: obj.channel,
      text: obj.text,
      time: obj.time,
      sender: obj.sender,
      avatar: obj.avatar,
      creationDate: obj.creationDate,
      timeStamp: obj.timeStamp,
      message: obj.message
    }
  }

  async addData(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObject(data, ''));
  }

  async updateData(colId: string, data: Channel) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForChannel(data));
    }
  }

  async updateArray(colId: string, id: string, newKey: Member) {
    if(id) {
      await updateDoc(this.getSingleDocRef(colId, id), {
        members: arrayUnion(this.firestoreHelper.getCleanJson(newKey))
    });
    }
  }

  async updateArrayMessages(colId: string, id: string, newKey: any) {
    if(id) {
      await updateDoc(this.getSingleDocRef(colId, id), {
        messages: arrayUnion(this.firestoreHelper.getCleanJsonForArray(newKey))
    });
    }
  }

  async addMember(data: Member) {
    await addDoc(this.getDocRef('members'), data);
  }

  async updateMember(colId: string, data: Member) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJson(data));
    }
  }

  async addMessage(data: Messenges) {
    await addDoc(this.getDocRef('messenges'), this.setObjectMessenges(data, ''));
  }

  async updateMessage(colId: string, data: Messenges) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForMessenges(data));
    }
  }

  async updateDirectMessage(colId: string, data: DirectMessage) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.firestoreHelper.getCleanJsonForDirectMessage(data));
    }
  }

  async addDirectMessage(data: DirectMessage) {
    await addDoc(this.getDocRef('direct-message'), this.setObjectDirectMessage(data, ''));
  }

  async addThread(data: Thread) {
    await addDoc(this.getDocRef('threads'), this.setObjectThreads(data, ''));
  }

  getDocRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
