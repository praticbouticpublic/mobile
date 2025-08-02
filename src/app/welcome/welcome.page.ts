import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DbacessService } from '../dbacess.service';
import { strings } from '../strings';
import { Boutic } from '../model.enum';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, isPlatform, MenuController, Platform } from '@ionic/angular/standalone';
import { InitSession } from '../initsession';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { SessionbackService } from '../sessionback.service';
import { PushNotificationService } from '../pushnotif.service';
import { addIcons } from "ionicons";
import { scan } from "ionicons/icons";
import {Capacitor} from "@capacitor/core";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
    standalone: false
})
export class WelcomePage implements OnInit {


    list = new Array<Boutic>();
    form: any;

    options: Boutic[] = [];
    opts: Boutic[] = [];
    filteredOptions!: Observable<Boutic[]>;
    loadingState = true;
    isSupported = false;
    barcodes: Barcode[] = [];
    lasturl = '';
    token = '';
    prod = environment.production;


    constructor(public dbas: DbacessService, public router: Router, public alert: AlertController, public fb: FormBuilder,
        public menuCtrl: MenuController, public session: InitSession, public storage: StorageService,
        public sessionback: SessionbackService, public pushnotif: PushNotificationService, public platform: Platform) {
        addIcons({ scan });
    }

    async ngOnInit() {
        // 1. Vérification du support scanner sur plateforme native
        this.platform.ready().then(async () => {
            const platform = Capacitor.getPlatform();

            if (isPlatform('capacitor') && (platform === 'android' || platform === 'ios')) {
                try {
                    const result = await BarcodeScanner.isSupported();
                    this.isSupported = result.supported;
                } catch (err) {
                    console.error('Erreur BarcodeScanner:', err);
                    this.isSupported = false;
                }
            } else {
                this.isSupported = false;
            }

            // 2. Notifications Push
            try {
                await this.pushnotif.requestPermissions();
                this.pushnotif.register();
                this.pushnotif.waitForToken().subscribe(token => {
                    this.token = token;
                });
            } catch (err) {
                console.error('Erreur Push:', err);
            }
        });

        // 3. Initialisation du formulaire
        this.form = new FormGroup({
            aliasboutic: new FormControl<string>(null)
        });

        // 4. Gestion du menu
        const isOpen = await this.menuCtrl.isOpen();
        if (!isOpen) {
            this.menuCtrl.enable(false);
        }

        // 5. Session utilisateur
        const logged = await this.sessionback.getLogged();
        if (logged) {
            this.router.navigate(['admin/login']);
        }

        // 6. Stockage de la dernière URL
        const status = await this.storage.get('status');
        if (status !== 'error') {
            await this.storage.set('lasturl', this.router.url);
        } else {
            this.lasturl = this.router.url;
        }

        // 7. Récupération des options
        (await this.dbas.getBoutics()).subscribe({
            next: (data1: any[]) => {
                data1.forEach((dat, idx) =>
                    this.options.push({
                        id: +dat[0],
                        alias: dat[1],
                        nom: dat[2],
                        logo: dat[3],
                        stripecustomerid: dat[4]
                    })
                );
            },
            complete: () => {
                this.loadingState = false;
                this.opts = this.options;
            },
            error: (err: any) => {
                this.presentErrAlert(strings.ErrConnect, err?.error?.error ?? 'Erreur inconnue');
            }
        });
    }

    ionViewDidEnter() {
        this.form.get('aliasboutic')?.setValue(null);
    }


    inputChanged($event: any) {
        const value = $event.target.value;
        const options = this.options.filter(
            option => option.nom.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        );
        this.opts = options;
    }

    selected(item: any) {
      this.router.navigate(['admin/debut/' + item.target.value + '/3/0']);
    }

    private _filter(name: string): Boutic[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.nom.toLowerCase().includes(filterValue));
    }

    routeTo(alias: string) {
        this.router.navigate([alias], { replaceUrl: true });
    }



    async scan(): Promise<void> {
        try
        {
            // 1. Vérification des permissions
            const granted = await this.requestPermissions();
            if (!granted) {
                await this.presentAlert('Les permissions pour le scanner de code barre sont requises.');
                return;
        }

        // 2. Vérification de la plateforme
        const platform = Capacitor.getPlatform();

        if (platform === 'android') {
            // 2A. Android : vérifier module Google Barcode
            const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

            if (!available) {
                await BarcodeScanner.installGoogleBarcodeScannerModule();
            }
        }

        // 3. Démarrage du scan (Android, iOS, Web — si compatible)
        const result = await BarcodeScanner.scan();

        const barcode = result?.barcodes?.[0]?.displayValue;
        if (!barcode) {
            console.warn('⚠️ Aucun QR code détecté');
            return;
        }

        const slug = barcode.split(environment.frontroot).pop();
        if (slug) {
            this.presentQRCodeAlert(slug);
        }

        } catch (err) {
            console.error('❌ Erreur lors du scan :', err);
            this.presentAlert('Erreur de lecture du QR code');
        }
    }

    async requestPermissions(): Promise<boolean> {
        const { camera } = await BarcodeScanner.requestPermissions();
        return camera === 'granted' || camera === 'limited';
    }

    async presentAlert(p0: string): Promise<void> {
        const alert = await this.alert.create({
            header: 'Permission refusé',
            message: 'S\'il vous plait autorisé l\'utilisation du scanner de code barre.',
            buttons: ['OK'],
        });
        await alert.present();
    }

    async presentErrAlert(header: string, message: string): Promise<void> {
        const alert = await this.alert.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.router.navigate(['admin/carte']);
                    }
                }
            ],
        });
        await alert.present();
    }

    async presentQRCodeAlert(str: string): Promise<void> {
        const alert = await this.alert.create({
            header: 'Résutat du scan',
            message: 'Acceptez-vous d\'être redirigé vers lien paramétré : ' + str,
            buttons: [
                {
                    text: 'OUI',
                    handler: data => {
                        this.router.navigate([str]);
                    }
                },
                {
                    text: 'NON',
                }
            ],
        });

        await alert.present();
    }

    getShowBarre(): boolean {
        return (sessionStorage.getItem('barre') !== 'fermer');
    }

    setShowBarre(etat: boolean) {
        sessionStorage.setItem('barre', etat ? 'fermer' : '');
    }


}
