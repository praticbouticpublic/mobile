import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonIcon, IonRadioGroup, IonRadio, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../../global.service'
import * as myGlobals from '../../../app/global';
import { paramForm } from 'src/app/paramform';
import { Observable } from 'rxjs';
import { addIcons } from "ionicons";
import { eyeOff, eye, closeOutline, checkmarkOutline } from "ionicons/icons";
import { HeaderService } from "../../header.service";
import {IonicModule} from "@ionic/angular";


@Component({
    selector: 'app-client',
    templateUrl: './client.page.html',
    styleUrls: ['./client.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class ClientPage extends paramForm implements OnInit, paramForm {
    hide: any;
    hide2: any;

    constructor(public formBuilder: FormBuilder, public alertController: AlertController, public httpClient: HttpClient,
        public platform: Platform, public router: Router, public storage: StorageService, public global: GlobalService,
        public header:HeaderService) {
        super(alertController, httpClient, storage, router, formBuilder);
        this.global.setFormComponent(this);
        this.nameform = 'settings';
        this.fields = [{
            type: 'pass',
            nom: 'clpass',
            param: 'pass',
            value: '',
            validators: [Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*?]).{8,}')]
        },
        {
            type: 'passconf',
            nom: 'clpassconf',
            param: 'passconf',
            value: '',
            validators: [Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*?]).{8,}')]
        },
        {
            type: 'radio',
            nom: 'clqualite',
            param: 'qualite',
            value: null,
            validators: [Validators.required]
        },
        {
            type: 'text',
            nom: 'clnom',
            param: 'nom',
            value: null,
            validators: [Validators.required, Validators.maxLength(255)]
        },
        {
            type: 'text',
            nom: 'clprenom',
            param: 'prenom',
            value: null,
            validators: [Validators.required, Validators.maxLength(255)]
        },
        {
            type: 'text',
            nom: 'cladr1',
            param: 'adr1',
            value: null,
            validators: [Validators.required, Validators.maxLength(255)]
        },
        {
            type: 'text',
            nom: 'cladr2',
            param: 'adr2',
            value: null,
            validators: [Validators.maxLength(255)]
        },
        {
            type: 'text',
            nom: 'clcp',
            param: 'cp',
            value: null,
            validators: [Validators.required, Validators.maxLength(5), Validators.pattern('[0-9]{5}')]
        },
        {
            type: 'text',
            nom: 'clville',
            param: 'ville',
            value: null,
            validators: [Validators.required, Validators.maxLength(255)]
        },
        {
            type: 'text',
            nom: 'cltel',
            param: 'tel',
            value: null,
            validators: [Validators.required, Validators.maxLength(255), Validators.pattern('(^(?:0|\\(?\\+33\\)?\\s?|0033\\s?)[0-9](?:[\\.\\-\\s]?\\d\\d){4}$)')]
        }
        ];
        addIcons({ eyeOff, eye, closeOutline, checkmarkOutline });
    }

    protected async getStoredForm(prop: string): Promise<Observable<string>> {
        const obj = { bouticid: this.bouticid, table: '', prop };
        return this.httpClient.post<string>(environment.apiroot + 'get-client-prop', obj, await this.header.buildHttpOptions());
    }

    protected async setStoredForm(prop: string, valeur: string): Promise<Observable<string>> {
        const obj = { bouticid: this.bouticid, table: '', prop, valeur };
        return this.httpClient.post<string>(environment.apiroot + 'set-client-prop', obj, await this.header.buildHttpOptions());
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
