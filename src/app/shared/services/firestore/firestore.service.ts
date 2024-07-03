import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot, collection, addDoc, updateDoc } from "firebase/firestore";
import { firstValueFrom } from 'rxjs';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  unsub: any;
  unsubMembers: any;
  channels: Channel[] = [];
  members: any[] = [];

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

  ngOnDestroy(): void {
    this.unsub();
    this.unsubMembers();
  }

  async addData(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObject(data, ''));
  }

  async updateData(colId: string, data: Channel) {
    if(data.id) {
      await updateDoc(this.getSingleDocRef(colId, data.id), this.getCleanJsonForChannel(data));
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
