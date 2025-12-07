
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuController, Platform, AlertController, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonButton, IonIcon, IonImg, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../../global.service'
import { paramForm } from 'src/app/paramform';
import { Observable } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { addIcons } from "ionicons";
import { copyOutline, closeOutline, checkmarkOutline } from "ionicons/icons";
import {HeaderService} from "../../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-shop',
    templateUrl: './shop.page.html',
    styleUrls: ['./shop.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class ShopPage extends paramForm implements OnInit, paramForm {

  srvroot = environment.srvroot;


    constructor(public platform: Platform, public menuCtrl: MenuController, public alertController: AlertController,
                public global: GlobalService, public formBuilder: FormBuilder, public router: Router,
                public storage: StorageService, public httpClient: HttpClient, public header:HeaderService) {
        super(alertController, httpClient, storage, router, formBuilder);
        this.global.setFormComponent(this);
        this.nameform = 'shop';
        this.fields = [{
            type: 'text',
            nom: 'alias',
            param: 'customer',
            value: null,
            validators: [Validators.required, Validators.pattern('[a-z0-9]{3,}')]
        },
        {
            type: 'text',
            nom: 'nom',
            param: 'nom',
            value: null,
            validators: [Validators.required]
        },
        {
            type: 'image',
            nom: 'logo',
            param: 'logo',
            value: null,
            validators: []
        },
        {
            type: 'text',
            nom: 'email',
            param: 'courriel',
            value: null,
            validators: [Validators.required, Validators.email]
        }];
        addIcons({ copyOutline, closeOutline, checkmarkOutline });
    }

    async getStoredForm(prop: string): Promise<Observable<string>> {
        const obj = { bouticid: this.bouticid, table: '', prop };
        return this.httpClient.post<string>(environment.apiroot + 'get-custom-prop', obj, await this.header.buildHttpOptions());
    }

    async setStoredForm(prop: string, valeur: string): Promise<Observable<string>> {
        const obj = { bouticid: this.bouticid, table: '', prop, valeur };
        return this.httpClient.post<string>(environment.apiroot + 'set-custom-prop', obj, await this.header.buildHttpOptions());
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


    writeToClipboard = async (txt: string) => {
        await Clipboard.write({
            string: txt
        });
    };

    async pickImages(): Promise<void> {
        const limit = 1;
        const readData = true;
        const skipTranscoding = false;
        const { files } = await FilePicker.pickImages({
            limit,
            readData,
            skipTranscoding,
        });
        this.uploadlogo(files);
    }


}
