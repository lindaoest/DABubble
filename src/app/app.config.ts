import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { registerLocaleData } from '@angular/common';
import localDe from '@angular/common/locales/de';

import { privateConfig } from './app.config-private';

registerLocaleData(localDe)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(
      privateConfig
    ))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    {provide: LOCALE_ID, useValue: 'de-DE'}
  ]
}
