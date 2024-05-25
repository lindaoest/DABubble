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
  channels: Channel[] = []

  constructor() {
    this.unsub = onSnapshot(this.getDocRef('channels'), (doc) => {
      this.channels = [];
      doc.forEach(element => {
        this.channels.push(this.setObject(element.data()))
      });
    });

    console.log('channels firestore', this.channels)
  }

  setObject(obj: any) {
    return {
      name: obj.name,
      description: obj.description
    }
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  async addData(data: Channel) {
    await addDoc(this.getDocRef('channels'), this.setObject(data));
  }

  getDocRef(colId:string) {
    return collection(this.firestore, colId);
  }
}
