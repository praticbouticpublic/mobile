import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DbacessService } from '../dbacess.service';
import { strings } from '../strings';
import { Boutic } from '../model.enum';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, isPlatform, MenuController, Platform } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { SessionbackService } from '../sessionback.service';
import { PushNotificationService } from '../pushnotif.service';
import { addIcons } from "ionicons";
import { scan } from "ionicons/icons";
import {Capacitor} from "@capacitor/core";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
    imports: [IonicModule, RouterLink, FormsModule, ReactiveFormsModule]
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
        public menuCtrl: MenuController, public storage: StorageService,
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
                    console.log('Token Push:', token);
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
            this.router.navigate(['admin/login'], { replaceUrl: true });
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
      this.router.navigate(['admin/debut/' + item.target.value + '/3/0'], { replaceUrl: false });
    }

    private _filter(name: string): Boutic[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.nom.toLowerCase().includes(filterValue));
    }

    routeTo(alias: string) {
        this.router.navigate([alias], { replaceUrl: false });
    }



    async scan(): Promise<void> {
        try {
            // 1. Vérification des permissions
            const granted = await this.requestPermissions();
            if (!granted) {
                await this.presentAlertScan('Permission refusée', 'Veuillez autoriser l\'accès à la caméra pour utiliser le scanner.');
                return;
            }

            // 2. Vérification de la plateforme
            const platform = Capacitor.getPlatform();
            if (platform === 'android') {
                const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
                if (!available) {
                    await BarcodeScanner.installGoogleBarcodeScannerModule();
                }
            }

            // 3. Démarrage du scan
            const result = await BarcodeScanner.scan();

            const barcode = result?.barcodes?.[0]?.displayValue;
            if (!barcode) {
                console.warn('⚠️ Aucun QR code détecté');
                return;
            }

            const slug = barcode.split(environment.frontroot).pop();
            if (slug)
            {
                this.presentQRCodeAlert(slug);
            }
        } catch (err: any) {
            const msg = err?.message?.toLowerCase() ?? '';
            // Gestion spécifique selon erreur
            if (msg.includes('permission')) {
                // Permission refusée par l'utilisateur
                await this.presentAlertScan('Permission refusée', 'Veuillez autoriser l\'accès à la caméra pour utiliser le scanner.');
                return;
            }
            if (msg.includes('canceled') || msg.includes('user cancelled')) {
                // Annulation volontaire, ne rien faire
                return;
            }
            // Autres erreurs
            console.error('❌ Erreur lors du scan :', err);
            await this.presentAlertScan('Erreur', 'Erreur de lecture du QR code');
        }
    }

    async presentAlertScan(header: string, message: string): Promise<void> {
        const alert = await this.alert.create({
            header,
            message,
            buttons: ['OK'],
        });
        await alert.present();
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
                        this.router.navigate(['admin/carte'], { replaceUrl: false });
                    }
                }
            ],
        });
        await alert.present();
    }

    async presentQRCodeAlert(str: string): Promise<void>
    {
        const alert = await this.alert.create({
            header: 'Résutat du scan',
            message: 'Acceptez-vous d\'être redirigé vers lien paramétré : ' + str,
            buttons: [
                {
                    text: 'OUI',
                    handler: data => {
                        const [segment1 = '', segment2 = '3', segment3 = '0'] = str.split('/');
                        const navigateUrl = `admin/debut/${segment1}/${segment2}/${segment3}`;
                        this.router.navigate( [navigateUrl], {replaceUrl: true})
                            .then(success => console.log('Navigation réussie ?', success))
                            .catch(err => console.error('Erreur navigation:', err));
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
