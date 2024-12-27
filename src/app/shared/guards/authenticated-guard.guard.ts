import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { privateConfig } from '../../app.config-private';
import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Router injizieren

  return new Promise<boolean>((resolve) => {
    const firebaseConfig = privateConfig;
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // Benutzer ist eingeloggt
      } else {
        router.navigate(['/login']); // Weiterleitung auf Login-Seite
        resolve(false); // Benutzer ist nicht eingeloggt
      }
    });
  });
};
