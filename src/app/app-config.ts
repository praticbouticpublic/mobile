import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { CommonModule } from "@angular/common";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        provideNgxStripe(environment.pkey),
        provideIonicAngular({
            innerHTMLTemplatesEnabled: true,
            swipeBackEnabled: false
        }),
        importProvidersFrom( CommonModule)
    ]
};
