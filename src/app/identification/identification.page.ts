import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonHeader, IonToolbar, IonImg, IonContent, IonLabel, IonItem, IonInput, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { addIcons } from "ionicons";
import { sendOutline, arrowUndoOutline } from "ionicons/icons";
import { HeaderService } from "../header.service";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-identification',
    templateUrl: './identification.page.html',
    styleUrls: ['./identification.page.scss'],
    imports: [IonicModule,  FormsModule, ReactiveFormsModule ]
})

export class IdentificationPage implements OnInit {

    identificationFormGroup: FormGroup;
    isSubmitted = false;
    lecode = '';
    long = 6;
    email = '';
    autoidentification = false;
    login: any;
    loaded = false;

    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, public http: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService,
        public header:HeaderService, public routerOutlet: IonRouterOutlet) {
        this.email = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        addIcons({ sendOutline, arrowUndoOutline });
    }

  hexToUint8Array(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

    get code(): string {
        return this.identificationFormGroup.value.code;
    }

    get errorControl() {
        return this.identificationFormGroup.controls;
    }

    // Function to convert a Base64 string to a Uint8Array (16-byte array)
    base64ToUint8Array(base64: string): Uint8Array {
        // Decode the Base64 string
        const binaryString = atob(base64);
        // Create a Uint8Array with the same length as the decoded string
        const byteArray = new Uint8Array(binaryString.length);
        // Convert each character to its byte value
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray;
    }

    async sendCode(elem: any) {
        if (elem !== null)
            elem.disabled = true;
        const sendcodepostData = {
            email: this.email
        };
        this.http.post<any[]>(environment.apiroot + 'send-code', sendcodepostData, await this.header.buildHttpOptions()).subscribe({
            next: async (data: any) => {
                const rawKey = new Uint8Array(this.hexToUint8Array(environment.identificationkey));
                crypto.subtle.importKey('raw', rawKey.buffer, { name: 'AES-CBC' }, true, ["decrypt"]).then(key => {
                  const iv = new Uint8Array(this.base64ToUint8Array(data[1]));
                  const encrypted = new Uint8Array(this.base64ToUint8Array(data[0]));
                    crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, encrypted).then(decrypted => {
                        this.lecode = new TextDecoder().decode(decrypted);
                        if (elem !== null)
                            elem.disabled = false;
                    }).catch(err => {
                        console.error("Decryption failed:", err);
                        if (elem !== null) elem.disabled = false;
                          this.identificationAlert("Erreur de déchiffrement" + err.message);
                    });
                });
            },
            error: (err: any) => {
                if (elem !== null)
                    elem.disabled = false;
                this.identificationAlert(err.error.error);
                this.remadelaststep();
            }
        });
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.identificationFormGroup = this.formBuilder.group({
            code: ['', [Validators.required, Validators.pattern('^[0-9]{6}'), Validators.maxLength(6)]]
        });


            this.storage.get('emailcode').then(emailsent => {
                this.loaded = true;
                if (((emailsent === null) || (emailsent === '')) && (this.autoidentification === false)) {
                    this.sendCode(null);
                    this.storage.set('emailcode', this.lecode);
                }
                else {
                    this.storage.get('emailcode').then(emailcode => {
                        this.lecode = emailcode;
                    });
                }
            });

    }

    ionViewWillEnter() {
        // Réactive le swipe-back uniquement sur cette page
        this.routerOutlet.swipeGesture = true;
    }

    ionViewWillLeave() {
        // Restaure le comportement global (désactivé)
        this.routerOutlet.swipeGesture = false;
    }

    onSubmit() {
        this.isSubmitted = true;
        if ((!this.identificationFormGroup.valid) && (this.autoidentification === false)) {
            return false;
        }
        else {
            if ((this.code === this.lecode) || (this.autoidentification === true)) {
                this.storage.set('login', this.email);
                this.storage.remove('emailcode');
                this.router.navigate(['admin/registrationdetails'], { replaceUrl: true });
            }
            else {
                this.sendcodeAlert();
            }

        }
    }

    cancel() {
        this.storage.set('stepfailed', '');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'registrationdetails':
                case 'shopdetails':
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case 'buildboutic':
                    this.autoidentification = true;
                    this.onSubmit();
                    break;
                case 'registration':
                case 'identification':
                case '':
                    break;
            }
        });
    }

    async sendcodeAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème lors de la saisie du code',
            message: 'Le code sur le formulaire et celui envoyé par courriel ne correspondent pas',
            buttons: ['OK']
        });

        await alert.present();

    }

    async identificationAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème Lors de l\'envoi courriel',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.storage.set('stepfailed', 'identification');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

}
