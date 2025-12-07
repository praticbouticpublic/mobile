
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonRouterOutlet, MenuController, Platform, IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonLabel, IonList, IonRadioGroup, IonRadio, IonInput, IonIcon, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import * as myGlobals from '../../app/global';
import { addIcons } from "ionicons";
import { eyeOff, eye, sendOutline, closeOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-registrationdetails',
    templateUrl: './registrationdetails.page.html',
    styleUrls: ['./registrationdetails.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class RegistrationdetailsPage implements OnInit {

    regdetForm: FormGroup;
    isSubmitted: any;
    hide = true;
    hide2 = true;
    loaded = false;
    autoregdetails = false;
    pass: any;


    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, public httpClient: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService, public header:HeaderService,
                public routerOutlet:IonRouterOutlet) {
        addIcons({ eyeOff, eye, sendOutline, closeOutline });

    }

    get errorControl() {
        return this.regdetForm.controls;
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.regdetForm = this.formBuilder.group({
            pass: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*?]).{8,}'),
            Validators.maxLength(255)]],
            passconf: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*?]).{8,}'),
            Validators.maxLength(255)]],
            qualite: ['', [Validators.required]],
            nom: ['', [Validators.required, Validators.maxLength(60)]],
            prenom: ['', [Validators.required, Validators.maxLength(60)]],
            adr1: ['', [Validators.required, Validators.maxLength(150)]],
            adr2: ['', [Validators.maxLength(150)]],
            cp: ['', [Validators.required, Validators.pattern('[0-9]{5}'), Validators.maxLength(5)]],
            ville: ['', [Validators.required, Validators.maxLength(50)]],
            tel: ['', [Validators.required, Validators.pattern('(^(?:0|\\(?\\+33\\)?\\s?|0033\\s?)[0-9](?:[\\.\\-\\s]?\\d\\d){4}$)')]]
        });

        this.storage.get('praticboutic_registrationdetails_motdepasse').then(motdepasse => {
            if (motdepasse !== null) {
                this.regdetForm.controls.pass.setValue(motdepasse);
            }
        });
        this.storage.get('praticboutic_registrationdetails_qualite').then(qualite => {
            if (qualite !== null) {
                this.regdetForm.controls.qualite.setValue(qualite);
            }
        });
        this.storage.get('praticboutic_registrationdetails_nom').then(nom => {
            if (nom !== null) {
                this.regdetForm.controls.nom.setValue(nom);
            }
        });
        this.storage.get('praticboutic_registrationdetails_prenom').then(prenom => {
            if (prenom !== null) {
                this.regdetForm.controls.prenom.setValue(prenom);
            }
        });
        this.storage.get('praticboutic_registrationdetails_adresse1').then(adresse1 => {
            if (adresse1 !== null) {
                this.regdetForm.controls.adr1.setValue(adresse1);
            }
        });
        this.storage.get('praticboutic_registrationdetails_adresse2').then(adresse2 => {
            if (adresse2 !== null) {
                this.regdetForm.controls.adr2.setValue(adresse2);
            }
        });
        this.storage.get('praticboutic_registrationdetails_codepostal').then(codepostal => {
            if (codepostal !== null) {
                this.regdetForm.controls.cp.setValue(codepostal);
            }
        });
        this.storage.get('praticboutic_registrationdetails_ville').then(ville => {
            if (ville !== null) {
                this.regdetForm.controls.ville.setValue(ville);
            }
        });
        this.storage.get('praticboutic_registrationdetails_telephone').then(telephone => {
            if (telephone !== null) {
                this.regdetForm.controls.tel.setValue(telephone);
            }
        });
    }

    async onSubmit() {
        this.loaded = false;
        this.isSubmitted = true;
        if ((!this.regdetForm.valid) && (this.autoregdetails === false)) {
            this.loaded = true;
            return false;
        }
        else {
            if ((this.regdetForm.value.pass !== this.regdetForm.value.passconf) && (this.autoregdetails === false)) {
                this.regmobAlert('Le mot de passe et sa confirmation doivent coïncider');
                this.loaded = true;
                return false;
            }
            else {
                this.storage.set('mdp', this.regdetForm.value.pass);
            }

            this.storage.set('praticboutic_registrationdetails_motdepasse', this.regdetForm.value.pass);
            this.storage.set('praticboutic_registrationdetails_qualite', this.regdetForm.value.qualite);
            this.storage.set('praticboutic_registrationdetails_nom', this.regdetForm.value.nom);
            this.storage.set('praticboutic_registrationdetails_prenom', this.regdetForm.value.prenom);
            this.storage.set('praticboutic_registrationdetails_adresse1', this.regdetForm.value.adr1);
            this.storage.set('praticboutic_registrationdetails_adresse2', this.regdetForm.value.adr2);
            this.storage.set('praticboutic_registrationdetails_codepostal', this.regdetForm.value.cp);
            this.storage.set('praticboutic_registrationdetails_ville', this.regdetForm.value.ville);
            this.storage.set('praticboutic_registrationdetails_telephone', this.regdetForm.value.tel);

            const regmobpostData = {
                pass: this.regdetForm.value.pass,
                qualite: this.regdetForm.value.qualite,
                nom: this.regdetForm.value.nom,
                prenom: this.regdetForm.value.prenom,
                adr1: this.regdetForm.value.adr1,
                adr2: this.regdetForm.value.adr2,
                cp: this.regdetForm.value.cp,
                ville: this.regdetForm.value.ville,
                tel: this.regdetForm.value.tel,
            };

            this.httpClient.post(environment.apiroot + 'registration', regmobpostData, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.header.setToken(data.token);
                    if (data.result === 'OK') {
                        this.router.navigate(['admin/shopdetails'], { replaceUrl: false });
                    }
                },
                error: (err: any) => {
                    this.regmobAlert(err.error.text);
                    this.remadelaststep();
                }
            });
        }
    }

    onCancel() {
        this.loaded = true;
        this.storage.set('stepfailed', '');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'shopdetails':
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case 'buildboutic':
                    this.autoregdetails = true;
                    this.onSubmit();
                    break;
                case 'registration':
                case 'identification':
                case 'registrationdetails':
                case '':
                    break;
            }
        });
        this.loaded = true;
        this.routerOutlet.swipeGesture = true;
    }

    ionViewDidLeave(): void {
        this.menuCtrl.enable(true);
        this.loaded = false;
        this.routerOutlet.swipeGesture = false;
    }

    async regmobAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème de l\' inscription ',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.storage.set('stepfailed', 'registrationdetails');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }
}
