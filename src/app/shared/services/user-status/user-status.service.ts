import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";
import { privateConfig } from '../../../app.config-private';
import { initializeApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {

  firebaseConfig = privateConfig;
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  db = getDatabase(this.app);
  userId: string | null = null; // Diese ID sollte beim Login gesetzt werden

  constructor() {
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


  setUpStatusListener() {
    if (!this.userId) return;


    // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
    // any time that connectionsRef's value is null (i.e. has no children) I am offline
    let myConnectionsRef = ref(this.db, `users/${this.userId}/connections`);

    // stores the timestamp of my last disconnect (the last time I was seen online)
    let lastOnlineRef = ref(this.db, `users/${this.userId}/lastOnline`);
    const connectedRef = ref(this.db, '.info/connected');

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        console.log('Connected to Firebase Realtime Database');
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        const con = push(myConnectionsRef);
        console.log(`Adding connection for user: ${this.userId}`);

        // When I disconnect, remove this device
        onDisconnect(con).remove();

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        set(con, true);
        console.log(`User ${this.userId} is now online`);

        // When I disconnect, update the last time I was seen online
        onDisconnect(lastOnlineRef).set(serverTimestamp()).then(() => {
          console.log(`Last online time for user ${this.userId} will be set on disconnect`);
        });
      }
    });
  }
}
