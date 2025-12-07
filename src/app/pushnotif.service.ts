import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
    FirebaseMessaging
} from '@capacitor-firebase/messaging';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { SessionbackService } from './sessionback.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { HeaderService } from "./header.service";

@Injectable({
    providedIn: 'root'
})

export class PushNotificationService {

    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public token$: Observable<string> = this.tokenSubject.asObservable();

    constructor(
        public storage: StorageService,
        private sessionback: SessionbackService,
        private httpClient: HttpClient,
        public router: Router,
        public alertController: AlertController,
        public header: HeaderService
    ) {
        console.log('🎯 PushNotificationService constructor');
        this.initializeFCM();
    }

    private async initializeFCM(): Promise<void> {
        console.log('🚀 initializeFCM started, platform:', Capacitor.getPlatform());

        if (Capacitor.getPlatform() !== 'web') {
            try {
                // Écouter les notifications reçues en premier plan
                await FirebaseMessaging.addListener('notificationReceived', (notification) => {
                    console.log('📬 Notification received:', notification);
                });

                // Écouter les actions sur les notifications
                await FirebaseMessaging.addListener('notificationActionPerformed', (action) => {
                    console.log('🔔 Notification action performed:', action);
                    this.Redirect();
                });

                // Écouter les changements de token
                await FirebaseMessaging.addListener('tokenReceived', (event) => {
                    console.log('🔑 FCM token received:', event.token);
                    this.setToken(event.token);
                });

                console.log('✅ FCM listeners registered');
            } catch (error) {
                console.error('❌ Error initializing FCM:', error);
            }
        } else {
            // Gestion Web avec Service Worker
            console.log('🌐 Web platform detected');
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener("message", (event: any) => {
                    console.log("📨 Service Worker message:", event);
                    if (event.data?.notification) {
                        const notification = new Notification(
                            event.data.notification.title,
                            {
                                body: event.data.notification.body,
                                icon: event.data.notification.icon
                            }
                        );
                        notification.onclick = () => {
                            console.log("🖱️ Notification clicked");
                            this.Redirect();
                        };
                    }
                });
            }
        }
    }

    async register(): Promise<void> {
        console.log('📝 register() called');
        try {
            if (Capacitor.getPlatform() !== 'web') {
                console.log('📱 Native platform - requesting permissions');

                // Demander les permissions
                const permResult = await FirebaseMessaging.requestPermissions();
                console.log('🔐 Permission result:', permResult);

                if (permResult.receive === 'granted') {
                    console.log('✅ Push notifications permission granted');

                    // Obtenir le token FCM
                    const tokenResult = await FirebaseMessaging.getToken();
                    console.log('📱 FCM Token:', tokenResult.token);
                    this.setToken(tokenResult.token);
                } else {
                    console.warn('⚠️ Push notifications permission denied');
                }
            } else {
                console.log('🌐 Web platform - getting token');

                // Vérifier que environment.firebase.vapidKey existe
                if (!environment.firebase?.vapidKey) {
                    throw new Error('VAPID key not configured in environment');
                }

                // Pour le web
                const registration = await navigator.serviceWorker.register(
                    'firebase-messaging-sw.js'
                );
                console.log('🔧 Service Worker registered:', registration);

                const tokenResult = await FirebaseMessaging.getToken({
                    vapidKey: environment.firebase.vapidKey,
                    serviceWorkerRegistration: registration
                });

                console.log('🌐 FCM Web Token:', tokenResult.token);
                this.setToken(tokenResult.token);
            }
        } catch (error) {
            console.error('❌ Error during FCM registration:', error);
            await this.presentAlert('Erreur lors de l\'inscription aux notifications: ' + JSON.stringify(error));
        }
    }

    async presentAlert(msg: string): Promise<void> {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème notification push',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    Redirect(): void {
        this.waitForToken().subscribe(token => {
            this.storage.get('bouticid').then(bouticid => {
                this.sessionback.getLogged().then(async logged => {
                    if ((logged === true) && (Number(bouticid) !== 0)) {
                        const obj = { bouticid, prop: 'device_id' };
                        this.httpClient.post<string>(
                            environment.apiroot + 'get-client-prop',
                            obj,
                            await this.header.buildHttpOptions()
                        ).subscribe({
                            next: (data: any) => {
                                if (data.value[0] === token) {
                                    this.router.navigate(['admin/orders'], { replaceUrl: false });
                                } else {
                                    window.open(
                                        window.location.protocol + '//' +
                                        window.location.host + '/admin',
                                        '_blank'
                                    );
                                }
                            },
                            error: (e: any) => {
                                this.presentAlert(e.error?.error || 'Erreur inconnue');
                            }
                        });
                    } else {
                        this.router.navigate(['admin/login'], { replaceUrl: true });
                    }
                });
            });
        });
    }

    public async requestPermissions(): Promise<void> {
        try {
            const result = await FirebaseMessaging.requestPermissions();
            console.log('🔐 Permissions result:', result);
        } catch (error) {
            console.error('❌ Error requesting permissions:', error);
        }
    }

    setToken(token: string): void {
        console.log('💾 Setting token:', token);
        this.tokenSubject.next(token);
    }

    waitForToken(): Observable<string> {
        const isWeb = (Capacitor.getPlatform() === "web");
        return this.token$.pipe(
            filter(token => isWeb ? token === "" : token !== "")
        );
    }

    async deleteToken(): Promise<void> {
        try {
            await FirebaseMessaging.deleteToken();
            console.log('🗑️ FCM Token deleted');
            this.setToken('');
        } catch (error) {
            console.error('❌ Error deleting token:', error);
        }
    }
}
