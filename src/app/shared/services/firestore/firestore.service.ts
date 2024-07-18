import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firstValueFrom } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Messenges } from '../../../../models/messenges.class';
import { DirectMessage } from '../../../../models/direct-message.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  unsub: any;
  unsubMembers: any;
  unsubMessenges: any;
  unsubDirectMessage: any;
  channels: Channel[] = [];
  members: any[] = [];
  messenges: any[] = [];
  direct_message: any[] = [];
  groupedMessages: { [channel: string]: { [date: string]: any[] } } = {};
  groupedDirectMessages: { [key: string]: any[] } = {};

  constructor() {
    this.unsub = onSnapshot(this.getDocRef('channels'), (doc) => {
      this.channels = [];
      doc.forEach(element => {
        this.channels.push(this.setObject(element.data(), element.id))
      });
    });

    this.unsubMembers = onSnapshot(this.getDocRef('members'), (doc) => {
      this.members = [];
      doc.forEach(element => {
        this.members.push(this.setObjectMembers(element.data(), element.id))
      });
    });

    this.unsubMessenges = onSnapshot(this.getDocRef('messenges'), (doc) => {
      doc.forEach(element => {
        this.messenges.push(this.setObjectMessenges(element.data(), element.id))
      });
      this.groupedMessages = this.groupMessagesByDateAndChannel(this.messenges);
    });

    this.unsubDirectMessage = onSnapshot(this.getDocRef('direct-message'), (doc) => {
      doc.forEach(element => {
        this.direct_message.push(this.setObjectDirectMessage(element.data(), element.id))
      });
      this.groupedDirectMessages = this.groupDirectMessagesBySender(this.direct_message);
      console.log('direct-message', this.groupedDirectMessages)
    });
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
      creationDate: obj.creationDate
    }
  }

  setObjectDirectMessage(obj: any, id: string) {
    return {
      id: id,
      sender: obj.sender,
      receiver: obj.receiver,
      messages: [
        {text: this.allMessages(obj)}
      ]
    }
  }

  allMessages(obj: any) {
    if(obj.messages) {
      for (let i = 0; i < obj.messages.length; i++) {
        let message = obj.messages[i];
        return message.text;
      }
    }
  }

  groupMessagesByDateAndChannel(messages: any[]): { [channel: string]: { [date: string]: any[] } } {
    return messages.reduce((groups, message) => {
      if (!message.channel || !message.creationDate) {
        console.warn('Message without creationDate or channel:', message);
        return groups;
      }
      const channel = message.channel; // z.B. 'grafik' oder 'editing'
      const date = message.creationDate; // YYYY-MM-DD

      if (!groups[channel]) {
        groups[channel] = {};
      }

      if (!groups[channel][date]) {
        groups[channel][date] = [];
      }

      groups[channel][date].push(message);
      return groups;
    }, {});
  }

  groupDirectMessagesBySender(direct_messages: any[]): { [key: string]: any[] } {
    return direct_messages.reduce((groups, direct_message) => {
      if (!direct_message.sender) {
        console.warn('direct_message:', direct_message);
        return groups;
      }
      const sender = direct_message.sender;

      if (!groups[sender]) {
        groups[sender] = [];
      }

      groups[sender].push(direct_message);
      return groups;
    }, {});
  }

  ngOnDestroy(): void {
    this.unsub();
    this.unsubMembers();
    this.unsubMessenges();
  }

  async addData(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObject(data, ''));
  }

  async updateData(colId: string, data: Channel) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.getCleanJsonForChannel(data));
    }
  }

  async updateArray(colId: string, id: string, newKey: Member) {
    if(id) {
      await updateDoc(this.getSingleDocRef(colId, id), {
        members: arrayUnion(this.getCleanJson(newKey))
    });
    }
  }

  async addMember(data: Member) {
    await addDoc(this.getDocRef('members'), data);
  }

  async updateMember(colId: string, data: Member) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.getCleanJson(data));
    }
  }

  async addMessage(data: Messenges) {
    await addDoc(this.getDocRef('messenges'), this.setObjectMessenges(data, ''));
  }

  async addDirectMessage(data: DirectMessage) {
    await addDoc(this.getDocRef('direct-message'), this.setObjectDirectMessage(data, ''));
  }

  getCleanJson(obj: Member) {
    return {
      member: obj.member,
      email: obj.email,
      password: obj.password,
      avatar: obj.avatar
    }
  }

  getCleanJsonForChannel(obj: Channel) {
    return {
      name: obj.name,
      description: obj.description,
      members: obj.members
    }
  }

  getDocRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
