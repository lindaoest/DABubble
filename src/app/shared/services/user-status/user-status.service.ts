import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";
import { privateConfig } from '../../../app.config-private';
import { initializeApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirestoreService } from '../firestore/firestore.service';
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { Member } from '../../../../models/member.class';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {

  private firebaseConfig = privateConfig;
  private app = initializeApp(this.firebaseConfig);
  private auth = getAuth(this.app);

  private db = getDatabase(this.app);
  private userId: string | null = null; // Diese ID sollte beim Login gesetzt werden

  constructor(
    public firestoreService: FirestoreService,
    public globalVariables: GlobalVariablesService
  ) {
    this.checkUserStatus();
  }

  public initialize(userId: string) {
    this.userId = userId;
    this.setUpStatusListener();
  }

  private checkUserStatus() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.setUpStatusListener();
      } else {
        this.userId = null;
        this.updateFirestoreStatus(false);
      }
    });
  }


  private async setUpStatusListener() {
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
    let updateMember;

    if(this.globalVariables.signed_in_member) {
      updateMember = this.firestoreService.members.find(
        (obj) => obj.member === this.globalVariables.signed_in_member.displayName
      );
    }

    if (updateMember) {
      const member: Member = {
        ...updateMember,
        isOnline: isOnline,
      };

      await this.firestoreService.updateMember('members', member);
    }
  }
}
