import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, MenuController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonCheckbox, IonSelect, IonSelectOption, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../../global.service'
import * as myGlobals from '../../../app/global';
import { paramForm } from 'src/app/paramform';
import { Observable } from 'rxjs';
import { addIcons } from "ionicons";
import { closeOutline, checkmarkOutline } from "ionicons/icons";
import {HeaderService} from "../../header.service";
import {IonicModule} from "@ionic/angular";


@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class SettingsPage extends paramForm implements OnInit, paramForm {

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    constructor(public platform: Platform, public menuCtrl: MenuController, public alertController: AlertController,
                public global: GlobalService, public formBuilder: FormBuilder, public router: Router,
                public storage: StorageService, public httpClient: HttpClient, public header:HeaderService ) {
        super(alertController, httpClient, storage, router, formBuilder);
        this.global.setFormComponent(this);
        this.nameform = 'settings';
        this.fields = [{
            type: 'text',
            nom: 'subjectmail',
            param: 'Subject_mail',
            value: null,
            validators: []
        },
        {
            type: 'bool',
            nom: 'validationsms',
            param: 'VALIDATION_SMS',
            value: null,
            validators: []
        },
        {
            type: 'bool',
            nom: 'verifcp',
            param: 'VerifCP',
            value: null,
            validators: []
        },
        {
            type: 'select',
            nom: 'choixpaiement',
            param: 'Choix_Paiement',
            value: null,
            validators: []
        },
        {
            type: 'text',
            nom: 'mpcomptant',
            param: 'MP_Comptant',
            value: null,
            validators: []
        },
        {
            type: 'text',
            nom: 'mplivraison',
            param: 'MP_Livraison',
            value: null,
            validators: []
        },
        {
            type: 'select',
            nom: 'choixmethod',
            param: 'Choix_Method',
            value: null,
            validators: []
        },
        {
            type: 'text',
            nom: 'cmlivrer',
            param: 'CM_Livrer',
            value: null,
            validators: []
        },
        {
            type: 'text',
            nom: 'cmemporter',
            param: 'CM_Emporter',
            value: null,
            validators: []
        },
        {
            type: 'prix',
            nom: 'mntmincmd',
            param: 'MntCmdMini',
            value: null,
            validators: []
        },
        {
            type: 'select',
            nom: 'sizeimg',
            param: 'SIZE_IMG',
            value: null,
            validators: []
        },
        {
            type: 'select',
            nom: 'moneysystem',
            param: 'MONEY_SYSTEM',
            value: null,
            validators: []
        }
        ];
        addIcons({ closeOutline, checkmarkOutline });
    }

    async getStoredForm(prop: string): Promise<Observable<string>> {
        const obj = { bouticid: this.bouticid, table: '', param: prop };
        return this.httpClient.post<string>(environment.apiroot + 'get-param', obj, await this.header.buildHttpOptions());
    }

    async setStoredForm(prop: string, valeur: string): Promise<Observable<any>> {
        const obj = { bouticid: this.bouticid, table: '', param: prop, valeur };
        return this.httpClient.post<string>(environment.apiroot + 'set-param', obj, await this.header.buildHttpOptions());
    }

    get errorControl() {
        return this.formGroup.controls;
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.init();
    }

    onViewDidEnter() {
        this.global.setFormComponent(this);
    }
}
