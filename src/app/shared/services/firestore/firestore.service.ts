import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";
import { firstValueFrom } from 'rxjs';
import { Channel } from '../../../../models/channel.class';

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
        this.channels.push(this.setObject(element.data()))
      });
    });

    this.unsubMembers = onSnapshot(this.getDocRef('members'), (doc) => {
      doc.forEach(element => {
        this.members.push(element.data())
      });
    });

    console.log('members', this.members)
  }

  setObject(obj: any) {
    return {
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
    await addDoc(this.getDocRef('channels'), this.setObject(data));
  }

  getDocRef(colId:string) {
    return collection(this.firestore, colId);
  }
}
