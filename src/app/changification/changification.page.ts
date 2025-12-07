import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, Platform, IonRouterOutlet } from '@ionic/angular/standalone';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../global.service';
import { strings } from '../strings';
import * as myGlobals from '../../app/global';
import { addIcons } from "ionicons";
import { sendOutline, arrowUndoOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-changification',
    templateUrl: './changification.page.html',
    styleUrls: ['./changification.page.scss'],
    imports: [IonicModule, ReactiveFormsModule]
})

export class ChangificationPage implements OnInit {


    changificationFormGroup: FormGroup;
    isSubmitted = false;
    lecode = '';
    long = 6; // code decimal sur 6 digit
    email = '';
    autochangification = false;
    login: any;

    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, public http: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService, public global: GlobalService,
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
        return this.changificationFormGroup.value.code;
    }

    get errorControl() {
        return this.changificationFormGroup.controls;
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

    async sendCode(elem: any): Promise<void> {
        if (elem !== null)
            elem.disabled = true;
        const sendcodepostData = {
            email: this.email
        };
        this.http.post<any[]>(environment.apiroot + 'send-code', sendcodepostData, await this.header.buildHttpOptions()).subscribe({
            next: async (data: any) => {
                const rawKey = new Uint8Array(this.hexToUint8Array(environment.identificationkey));
                crypto.subtle.importKey('raw', rawKey, { name: 'AES-CBC' }, true, ["decrypt"]).then(key => {
                    const iv =  new Uint8Array(this.base64ToUint8Array(data[1]));
                    const encrypted =  new Uint8Array(this.base64ToUint8Array(data[0]));
                    crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, encrypted).then(decrypted => {
                        this.lecode = new TextDecoder().decode(decrypted);
                        if (elem !== null)
                            elem.disabled = false;
                    }).catch(err => {
                        console.error("Decryption failed:", err);
                        if (elem !== null) elem.disabled = false;
                        this.changificationAlert("Erreur de déchiffrement : " + err.message );
                    });
                });
            },
            error: (err: any) => {
                if (elem !== null)
                    elem.disabled = false;
                this.changificationAlert(err.error.error);
                this.remadelaststep();
            }
        });
    }

    ngOnInit(): void {
        this.storage.set('lasturl', this.router.url);
        this.changificationFormGroup = this.formBuilder.group({
            code: ['', [Validators.required, Validators.pattern('^[0-9]{6}'), Validators.maxLength(6)]]
        });

            this.storage.get('emailcode').then(emailsent => {
                if (((emailsent === null) || (emailsent === '')) && (this.autochangification === false)) {
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



    onSubmit(): boolean {
        this.isSubmitted = true;
        if ((!this.changificationFormGroup.valid) && (this.autochangification === false)) {
            return false;
        }
        else {
            if ((this.code === this.lecode) || (this.autochangification === true)) {
                this.storage.set('login', this.email);
                this.storage.remove('emailcode');
                this.radressboutic();
            }
            else {
                this.sendcodeAlert();
            }
            return true;
        }
    }

    cancel() {
        this.router.navigate(['admin/raddressing'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.routerOutlet.swipeGesture = true;
    }

    ionViewDidLeave() {
        // Restaure le comportement global (désactivé)
        this.routerOutlet.swipeGesture = false;

    }

    async sendcodeAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Error,
            subHeader: strings.InputTrouble,
            message: strings.VerificationMismatch,
            buttons: ['OK']
        });

        await alert.present();

    }

    async changificationAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Error,
            subHeader: strings.TroubleSendingMail,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.router.navigate(['admin/raddressing'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

    async radressboutic() {

        const obj = { email: this.email };
        this.http.post<any>(environment.apiroot + 'radress-boutic', obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.global.setLogin(this.email);
                this.storage.set('login', this.email);
                this.gotoAdmin();
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
            }
        })
    }

    gotoAdmin()
    {
        this.menuCtrl.enable(true);
        this.router.navigate(['admin/products'], { replaceUrl: true });
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Error,
            subHeader: strings.IdentificationTrouble,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }
}
