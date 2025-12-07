
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonLabel, IonList, IonInput, IonButton, IonCheckbox, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import './../string.extensions';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import * as myGlobals from '../../app/global';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { addIcons } from "ionicons";
import { sendOutline, closeOutline } from "ionicons/icons";
import { HeaderService } from "../header.service";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-shopdetails',
    templateUrl: './shopdetails.page.html',
    styleUrls: ['./shopdetails.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class ShopdetailsPage implements OnInit {
    shopdetForm: FormGroup;
    isSubmitted = false;
    yourImageDataURL: any;
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    loaded = false;
    srclogo: any;
    logoloaded = true;
    autoshopdetails = false;
    files: PickedFile[] = [];

    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController,
        public httpClient: HttpClient, public alertController: AlertController, public platform: Platform,
        public storage: StorageService, public header:HeaderService, public routerOutlet: IonRouterOutlet) {
        this.srvroot = environment.srvroot;
        this.apiroot = environment.apiroot;
        addIcons({ sendOutline, closeOutline });
    }

    get nom() {
        return this.shopdetForm.value.nom;
    }

    get aliasboutic() {
        return this.shopdetForm.value.aliasboutic;
    }

    get email() {
        return this.shopdetForm.value.email;
    }

    get errorControl() {
        return this.shopdetForm.controls;
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set aliasboutic(str: any) {
        this.shopdetForm.value.aliasboutic = str;
    }

    expurger(str: any): any {
        let ret = '';
        const charok = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (const s of str) {
            for (const ch of charok) {
                if (s === ch) {
                    ret = ret + s;
                }
            }
        }
        return ret;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    Correction($event: any) {
        this.shopdetForm.controls.aliasboutic.setValue(this.expurger((this.shopdetForm.value.nom).toLowerCase().sansAccent()));
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);

        this.shopdetForm = this.formBuilder.group({
            nom: ['', [Validators.required, Validators.maxLength(100)]],
            aliasboutic: ['', [Validators.required, Validators.pattern('[a-z0-9]{3,}'), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(255)]]
        });
        this.storage.get('praticboutic_shopdetails_nom').then(nom => {
            if (nom !== null) {
                this.shopdetForm.controls.nom.setValue(nom);
            }
        });
        this.storage.get('praticboutic_shopdetails_aliasboutic').then(aliasboutic => {
            if (aliasboutic !== null) {
                this.shopdetForm.controls.aliasboutic.setValue(aliasboutic);
            }
        });
        this.storage.get('praticboutic_shopdetails_email').then(email => {
            if (email !== null) {
                this.shopdetForm.controls.email.setValue(email);
            }
        });
        this.storage.get('praticboutic_shopdetails_logo').then(logo => {
            if ((logo !== null) || (logo !== '')) {
                this.srclogo = logo;
            }
            else {
                this.srclogo = null;
            }
        });
    }

    async onSubmit() {
        this.loaded = false;
        this.isSubmitted = true;
        if ((!this.shopdetForm.valid) && (this.autoshopdetails === false)) {
            this.loaded = true;
            return false;
        }
        else {
            this.storage.set('praticboutic_shopdetails_nom', this.shopdetForm.value.nom);
            this.storage.set('praticboutic_shopdetails_aliasboutic', this.shopdetForm.value.aliasboutic);
            if (this.srclogo !== null) {
                this.storage.set('praticboutic_shopdetails_logo', this.srclogo);
            }
            this.storage.set('praticboutic_shopdetails_email', this.shopdetForm.value.email);

            const shopmobpostData = {
                nom: this.shopdetForm.value.nom,
                aliasboutic: this.shopdetForm.value.aliasboutic,
                logo: this.srclogo,
                email: this.shopdetForm.value.email,
            };

            this.httpClient.post(environment.apiroot + 'register-boutic', shopmobpostData, await this.header.buildHttpOptions()).subscribe({
                next: async (data: any) => {
                    this.header.setToken(data.token);
                    this.router.navigate(['admin/shopsettings'], { replaceUrl: false });
                },
                error: (err: any) => {
                    this.loaded = false;
                    this.presentAlert(err.error.error);
                    this.remadelaststep();
                }
            });
        }
    }

    onCancel() {
        this.loaded = true;
        this.storage.set('stepfailed', '');
        this.router.navigate(['admin/registrationdetails'], { replaceUrl: true });
    }

    async uploadlogo(fileInput: any)
    {
        // Fonction pour convertir base64 en Blob
        function base64ToBlob(base64Data: string, mimeType: string) {
            const byteString = atob(base64Data.split(',')[1] || base64Data);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const intArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            return new Blob([intArray], { type: mimeType });
        }

        let blob: Blob;

        if (fileInput.data && fileInput.mimeType) {
            blob = base64ToBlob(fileInput.data, fileInput.mimeType);
        } else if (fileInput.blob) {
            blob = fileInput.blob;
        } else if (fileInput.files && fileInput.files[0]) {
            blob = fileInput.files[0];
        } else {
            console.error("Impossible de récupérer le fichier à uploader");
            return;
        }

        const formData = new FormData();
        formData.append('file', blob, fileInput.name);

        this.logoloaded = false;

        this.httpClient.post(environment.apiroot + 'upload', formData,
            await this.header.buildHttpOptions(true)).subscribe({
            next: async (data: any) => {
                this.header.setToken(data.token);
                this.srclogo = data.result;
                if (this.srclogo !== null) {
                    this.storage.set('praticboutic_shopdetails_logo', this.srclogo);
                }
                this.logoloaded = true;
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
            }
        });
    }

    closeimg(elem: any) {
        this.srclogo = null;
        this.storage.remove('praticboutic_shopdetails_logo');
    }

    onFileChoose(elem: any) {
        this.uploadlogo(elem.target);
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.set('lasturl', this.router.url);
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case 'buildboutic':
                    this.autoshopdetails = true;
                    this.onSubmit();
                    break;
                case 'registration':
                case 'identification':
                case 'registrationdetails':
                case 'shopdetails':
                case '':
                    break;
            }
        });
        this.loaded = true;
        this.routerOutlet.swipeGesture = true;
    }

    ionViewDidLeave(): void {
        this.loaded = false;
        this.menuCtrl.enable(false);
        this.routerOutlet.swipeGesture = false;
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème de l\'enregistremnt de la boutic ',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    loadImageFromDevice(event: any) {

        const file = event.target;
        this.uploadlogo(file);
    };

    remadelaststep() {
        this.storage.set('stepfailed', 'shopdetails');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

    async pickImages(): Promise<void> {
        const limit = 1;
        const readData = true;
        const skipTranscoding = false;
        const { files } = await FilePicker.pickImages({
            limit,
            readData,
            skipTranscoding,
        });
        if (files?.length > 0) {
            this.uploadlogo(files[0]);  // ✅ Passe uniquement le fichier
        } else {
            console.warn("Aucun fichier sélectionné.");
        }
    }
}
