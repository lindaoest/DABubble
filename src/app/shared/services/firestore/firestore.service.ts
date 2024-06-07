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

  unsub:any;
  unsubMembers:any;
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
      doc.forEach(element => {
        this.members.push(element.data())
      });
    });
  }

  setObject(obj: any, id:string) {
    return {
      id: id,
      name: obj.name,
      description: obj.description,
      members: obj.members
    }
  }

  ngOnDestroy(): void {
    this.unsub();
    this.unsubMembers();
  }

  async addData(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObject(data, ''));
  }

  async updateData(colId:string, data:Channel) {
    await updateDoc(this.getSingleDocRef(colId, data.id), {data});
  }

  async addMember(data: Member) {
    await addDoc(this.getDocRef('members'), this.setObject(data, ''));
  }

  getDocRef(colId:string) {
    return collection(this.firestore, colId);
  }

  getSingleDocRef(colId:string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
