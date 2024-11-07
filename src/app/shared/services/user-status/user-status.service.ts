import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";
import { privateConfig } from '../../../app.config-private';
import { initializeApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirestoreService } from '../firestore/firestore.service';
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { Member } from '../../../../models/member.class';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {

  firebaseConfig = privateConfig;
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  private afs!: Firestore;

  db = getDatabase(this.app);
  userId: string | null = null; // Diese ID sollte beim Login gesetzt werden

  constructor(public firestoreService: FirestoreService, public globalVariables: GlobalVariablesService) {
    this.checkUserStatus();
  }

  initialize(userId: string) {
    this.userId = userId;
    console.log(`Initializing status listener for user: ${userId}`);
    this.setUpStatusListener();
  }

  checkUserStatus() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        console.log(`Benutzer ist eingeloggt mit ID: ${this.userId}`);
        this.setUpStatusListener();
      } else {
        console.log('Kein Benutzer eingeloggt.');
        this.userId = null;
      }
    });
  }


  async setUpStatusListener() {
    if (!this.userId) return;

    const myConnectionsRef = ref(this.db, `users/${this.userId}/connections`);
    const lastOnlineRef = ref(this.db, `users/${this.userId}/lastOnline`);
    const connectedRef = ref(this.db, '.info/connected');

    onValue(connectedRef, async (snap) => {
      if (snap.val() === true) {
        const con = push(myConnectionsRef);

        // Remove this device connection on disconnect
        onDisconnect(con).remove();

        // Set this device as online
        await set(con, true);

        // Update Firestore's `isOnline` status to true
        await this.updateFirestoreStatus(true);

        // Set last online time on disconnect
        onDisconnect(lastOnlineRef).set(serverTimestamp());
      } else {
        // Set Firestore's `isOnline` status to false on disconnect
        await this.updateFirestoreStatus(false);
      }
    });
  }

  // Helper method to update Firestore status
  private async updateFirestoreStatus(isOnline: boolean) {
    const updateMember = this.firestoreService.members.find(
      (obj) => obj.member === this.globalVariables.signed_in_member.displayName
    );

    console.log('isOnline', isOnline);


    if (updateMember) {
      const member: Member = {
        ...updateMember,
        isOnline: isOnline,
      };

      await this.firestoreService.updateMember('members', member);
      console.log(`Updated Firestore isOnline status to ${isOnline} for user ${this.userId}`);
    }
  }
}
