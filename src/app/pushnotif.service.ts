import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { SessionbackService } from './sessionback.service';
import { HttpClient } from '@angular/common/http';
import * as myGlobals from './../app/global';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import {HeaderService} from "./header.service";

@Injectable({
    providedIn: 'root'
})

export class PushNotificationService {

    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // Observable pour permettre aux autres composants de s'abonner
    public token$: Observable<string> = this.tokenSubject.asObservable();

    constructor(public storage: StorageService, private sessionback: SessionbackService, private httpClient: HttpClient,
        public router: Router, public alertController: AlertController, public header:HeaderService) {
        if (Capacitor.getPlatform() !== 'web') {
            /*FirebaseMessaging.addListener("notificationReceived", (event) => {
            console.log("notificationReceived: ", { event });
            alert('Push received: ' + JSON.stringify(event));
          });
          FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
            console.log("notificationActionPerformed: ", { event });
            this.Redirect();
          });*/

            PushNotifications.addListener('registration',
                (token: Token) => {
                    //alert('Push registration success, token: ' + token.value);
                    //const options: GetTokenOptions = {
                    //  vapidKey: environment.firebase.vapidKey,
                    //};
                    /*if (Capacitor.getPlatform() === "web") {
                      options.serviceWorkerRegistration =
                        await navigator.serviceWorker.register("firebase-messaging-sw.js");
                    }*/
                    //const { token } = await FirebaseMessaging.getToken(options);
                    this.setToken(token.value);
                }
            );

            PushNotifications.addListener('registrationError',
                (error: any) => {
                    alert('Error on registration: ' + JSON.stringify(error));
                }
            );

            PushNotifications.addListener('pushNotificationReceived',
                (notification: PushNotificationSchema) => {
                    //alert('Push received: ' + JSON.stringify(notification));
                }
            );

            PushNotifications.addListener('pushNotificationActionPerformed',
                (notification: ActionPerformed) => {
                    //alert('Push action performed: ' + JSON.stringify(notification));
                    this.Redirect();
                }
            );

        }


        if (Capacitor.getPlatform() === "web") {
            navigator.serviceWorker.addEventListener("message", (event: any) => {
                console.log("serviceWorker message: ", { event });
                const notification = new Notification(event.data.notification.title, {
                    body: event.data.notification.body,
                });
                notification.onclick = (event) => {
                    console.log("notification clicked: ", { event });
                    this.Redirect();
                };
            });
        }



    }

    register() {
        // Placez ici la logique à exécuter une fois le token disponible
        if (Capacitor.getPlatform() !== 'web') {
            PushNotifications.register();
        }
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème notification push',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    Redirect() {
        this.waitForToken().subscribe(token => {
            this.storage.get('bouticid').then(bouticid => {
                this.sessionback.getLogged().then(async logged => {
                    if ((logged === true) && (Number(bouticid) !== 0)) {
                        const obj = { bouticid, prop: 'device_id' };
                        this.httpClient.post<string>(environment.apiroot + 'get-client-prop', obj, await this.header.buildHttpOptions()).subscribe({
                            next: (data: any) => {
                                if (data.value[0] === token)
                                    this.router.navigate(['admin/orders'], { replaceUrl: true });
                                else
                                    window.open(window.location.protocol + '//' + window.location.host + '/admin', '_blank');
                            },
                            error: (e: any) => {
                                this.presentAlert(e.error.error);
                            }
                        });
                    }
                    else {
                        this.router.navigate(['admin/login']);
                    }
                });
            });
        });
    }

    public async requestPermissions(): Promise<void> {
        if (Capacitor.getPlatform() !== 'web') {
            await PushNotifications.requestPermissions();
        }
    }

    /*public async getToken(): Promise<void> {
      const options: GetTokenOptions = {
        vapidKey: environment.firebase.vapidKey,
      };
      if (Capacitor.getPlatform() === "web") {
        options.serviceWorkerRegistration =
          await navigator.serviceWorker.register("firebase-messaging-sw.js");
      }
      const { token } = await FirebaseMessaging.getToken(options);
      this.token = token;
    }*/

    // Méthode pour mettre à jour le token
    setToken(token: string): void {
        this.tokenSubject.next(token);
    }

    // Méthode pour attendre que le token devienne non vide
    waitForToken(): Observable<string> {
        const isWeb = (Capacitor.getPlatform() === "web");
        return this.token$.pipe(
            filter(token => isWeb ? token === "" : token !== "")
        );

    }

}
