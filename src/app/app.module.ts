import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonImg, IonLabel,
    IonNote, IonMenuToggle, IonItem, IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { provideNgxStripe, NgxStripeModule } from 'ngx-stripe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [],
    bootstrap: [],
    imports: [
        BrowserModule,
        NgbModule,
        NgxStripeModule.forRoot(environment.pkey),
        IonApp,
        IonSplitPane,
        IonMenu,
        IonContent,
        IonList,
        IonImg,
        IonLabel,
        IonNote,
        IonMenuToggle,
        IonItem,
        IonIcon,
        IonRouterOutlet
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
        provideNgxStripe(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        provideIonicAngular({ innerHTMLTemplatesEnabled: true })
    ]
})
export class AppModule {
    constructor() {
        registerLocaleData(fr.default);
    }
}
