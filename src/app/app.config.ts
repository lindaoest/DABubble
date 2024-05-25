import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"da-bubble-88b90","appId":"1:380023840169:web:686b7738004d68493e38b8","storageBucket":"da-bubble-88b90.appspot.com","apiKey":"AIzaSyDiJdL9nmiEeGNm25HYVbdUrMkmCXbcOPY","authDomain":"da-bubble-88b90.firebaseapp.com","messagingSenderId":"380023840169"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
