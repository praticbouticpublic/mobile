import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform } from '@ionic/angular/standalone';
import { Location, NgClass } from '@angular/common';
import { GetbackService } from 'src/app/getback.service';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModeleService } from 'src/app/modele.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import {HeaderService} from "../../header.service";
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import {SelparamService} from "../../selparam.service";
import {SubmitBase} from "../../submitbase";
import {IonicModule} from "@ionic/angular";


interface recimage {
    pkid: number;
    bouticid: number;
    artid: number;
    filename: string;
    favori: boolean;
    visible: boolean;
}


@Component({
    selector: 'app-presentationrecord',
    templateUrl: './presentationrecord.component.html',
    styleUrls: ['./presentationrecord.component.scss'],
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        NgbCarousel,
        NgbSlide
    ],
})

export class PresentationrecordComponent extends SubmitBase implements OnInit {

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    statusAlertOptions: any = {
        cssClass: 'statusAlertCss',
    };
    myTitle = '';
    noimage: any;
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    elemimage: any;
    eleminpimg: any;
    elemclose: any;
    formloaded = false;
    logoloaded = true;
    colorcode: any;
    imagesrc = '';
    lastactive: boolean;
    latable: any;

    @Input() action: string;
    @Input() table: string;
    @Input() selcol: string;
    @Input() selid: number;
    @Input() id: number;

    constructor(public router: Router, public menuCtrl: MenuController, public location: Location,
        public getback: GetbackService, public alertController: AlertController, public platform: Platform,
        public storage: StorageService, public httpClient: HttpClient, public formAction: FormBuilder,
        public model: ModeleService, public global: GlobalService, public msg: MessageService,
        public header:HeaderService, public selparam: SelparamService) {

        super(model, storage, getback, router, selparam, alertController, httpClient, header, global, formAction);

        if (this.table === 'commande')
            this.latable = this.model.getTableParNom('lignecmd');
    }


    async ngOnInit()
    {
        this.input_action = this.action;
        this.input_table = this.table;
        this.input_selcol = this.selcol;
        this.input_selid = this.selid;
        this.input_id = this.id;
        await this.initialize();
        this.model.error.subscribe((publication) => {
            if (publication.form === this) {
                if (publication.msg !== null)
                    this.presentAlert(publication.msg);
                else
                    this.gotoUpperPage(null);
            }
        })
        this.msg.init();
        this.loading = false;
    }

    ngOnDestroy() {
        this.msg.completeMessage();
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
    }

    ionViewWillLeave() {
        this.msg.completeMessage();
    }






    onInputChange(event: Event, champ: any, numero: any) {
        if (champ.typ !== 'fk') {
            if ((((event.target) as HTMLInputElement).value !== null) &&
                ((((event.target) as HTMLInputElement).value !== '' || champ.typ !== 'image'))) {
                if (champ.typ === 'bool') {
                    this.storage.set('mem_fld_' + numero,
                        ((event.target) as HTMLInputElement).checked ? '1' : '0');
                }
                else {
                    this.storage.set('mem_fld_' + numero,
                        ((event.target) as HTMLInputElement).value);
                }
            }
        }
    }

    onAddImgToLst(files: any) {
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

        const formData = new FormData();

        for (let file of files) {
            let blob: Blob;

            if (file.data && file.mimeType) {
                blob = base64ToBlob(file.data, file.mimeType);
            } else if (file.blob) {
                blob = file.blob;
            } else {
                blob = file;
            }

            formData.append('file[]', blob, file.name);
        }

        this.logoloaded = false;

        this.httpClient.post<string[]>(this.apiroot + 'boupload', formData, { withCredentials: true }).subscribe({
            next: (data) => {
                this.lastactive = true;
                for (let dat of data) {
                    const img = {
                        pkid: 0,
                        artid: this.id,
                        bouticid: +this.bouticid,
                        filename: String(dat),
                        favori: false,
                        visible: true
                    };
                    SubmitBase.listimgvis.push(img as recimage);
                    SubmitBase.listimg.push(img as recimage);
                }
                this.logoloaded = true;
            },
            error: (err) => {
                this.logoloaded = true;
                this.presentAlert(err.error?.error || 'Erreur lors de l\'upload');
            }
        });
    }

    onLienChange(event: Event, champ: any, numero: any) {
        if (champ.typ === 'fk') {
            if (((((event.target) as HTMLInputElement).value !== null) &&
                ((event.target) as HTMLInputElement).value !== '')) {
                this.storage.set('mem_fld_' + numero, ((event.target) as HTMLInputElement).value);
            }
        }
    }

    onRemoveImgFromLst(i: number) {
        SubmitBase.listimg[i].visible = false;
        SubmitBase.listimgvis.splice(i, 1);
    }

    onChangeFavImg(i: number) {
        let favoristatus = SubmitBase.listimgvis[i].favori;
        for (let imgvis of SubmitBase.listimgvis) {
            imgvis.favori = false;
        }
        for (let img of SubmitBase.listimg) {
            img.favori = false;
        }
        SubmitBase.listimgvis[i].favori = !favoristatus;
        if (SubmitBase.listimgvis[i].pkid !== 0) {
            for (let img of SubmitBase.listimg) {
                if (SubmitBase.listimgvis[i].pkid === img.pkid) {
                    img.favori = !favoristatus;
                }
            }
        }
    }

    async onCancelUpdate(event: Event) {
        let j = -1;
        for (const champ of this.champs) {
            j++;
            let fld: any;
            if (champ.typ !== 'pk') {
                this.storage.remove('mem_fld_' + j);
            }
        }
        this.global.setFormComponent(this);
        this.loading = true;
        this.genValeursparDefaut();
    }

    async onStatutChange(event: CustomEvent, i: number) {
        const value = event.detail.value;

        // Construction de la ligne pour la BDD
        const row = [{ nom: 'statid', valeur: value, type: 'fk' }];

        // Mise à jour (attente si asynchrone)
        await this.model.updaterow(
            this.bouticid,
            this.model.getTable(this.numtable).nom,
            row,
            'cmdid',
            this.id,
            this
        );

        // Envoi du SMS
        await this.sendStatutSMS(this.bouticid, this.id);

        // Mise à jour locale de valeurs[i]
        const option = this.liste[i].find(optelem => optelem.id === value);
        if (option) {
            this.valeurs[i] = {
                ...this.valeurs[i],
                id: option.id,
                couleur: option.couleur,
                valeur: option.valeur
            };
        }

        // Déclenche un refresh global
        this.msg.publishMessage('refresh');
    }

    isStatutFieldValid(champ: any, i: number): boolean {
        return champ.nom === 'statid'
            && this.liste.length > i && this.liste[i]?.length > 0
            && this.valeurs.length > i && this.valeurs[i]
            && this.action === 'view'
            && this.nomliens.length === this.champs.length;
    }

    async sendSMS(bouticid: any, telephone: any, message: any)
    {
        const obj = { bouticid, telephone, message };
        this.httpClient.post(environment.apiroot + 'send-sms', obj, await this.header.buildHttpOptions()).subscribe({
            next: async (data: any) => { },
            error: (err: any) => this.presentAlert(err.error.error)
        });
    }

    async sendStatutSMS(bouticid: any, cmdid: any)
    {
        const obj = { bouticid, table: "commande", cmdid };

        this.httpClient.post(environment.apiroot + "get-com-data", obj, await this.header.buildHttpOptions()).subscribe({
            next: async (data: any) => await this.sendSMS(bouticid, data.data[0], data.data[1]),
            error: (err: any) => this.reconnect()
        });
    }



    onClickNextImg(event: any) {
        let favori = (event.currentTarget as HTMLElement);
        let active = Array.from(favori.parentElement.querySelectorAll('.active'));
        if (active[0].classList.contains('favori') === true) {
            (document.getElementById('favoriid') as HTMLIonImgElement).src = 'assets/svg/favori_selected.svg';
        }
        else {
            (document.getElementById('favoriid') as HTMLIonImgElement).src = 'assets/svg/favori_unselected.svg';
        }
    }

    onClickPrevImg(event: any) {
        let favori = (event.currentTarget as HTMLElement);
        let active = Array.from(favori.parentElement.querySelectorAll('.active'));
        if (active[0].classList.contains('favori') === true) {
            (document.getElementById('favoriid') as HTMLIonImgElement).src = 'assets/svg/favori_selected.svg';
        }
        else {
            (document.getElementById('favoriid') as HTMLIonImgElement).src = 'assets/svg/favori_unselected.svg';
        }
    }

    async pickImages(): Promise<void> {
        const limit = 0;
        const readData = true;
        const skipTranscoding = false;
        const { files } = await FilePicker.pickImages({
            limit,
            readData,
            skipTranscoding,
        });
        this.onAddImgToLst(files)
    }

    protected SubmitBase = SubmitBase;


    SubmitAction(event: Event)
    {
        super.onSubmit(event, this.action );
    }

    gotoUpperPage(event: Event)
    {
        super.gotoUpperPage(event, this.action );
    }

    goBack()
    {
        this.getback.publishGetback({ table: this.input_table, action: this.input_action + 'record' });
        if (this.input_selid === 0)
        {
            this.input_selcol = '';
            switch (this.input_table)
            {
                case 'categorie':
                case 'article':
                case 'groupeopt':
                    this.router.navigate(['admin/products/' + this.input_table], {replaceUrl: true});
                    break;
                case 'barlivr':
                case 'cpzone':
                    this.router.navigate(['admin/deliveries/' + this.input_table], {replaceUrl: true});
                    break;
                case 'statutcmd':
                    this.router.navigate(['admin/customerarea/' + this.input_table], {replaceUrl: true});
                    break;
                case 'promotion':
                    this.router.navigate(['admin/promotion'], {replaceUrl: true});
                    break;
                default:
                    this.router.navigate(['admin/products/article'], {replaceUrl: true});
                    break;

            }
        }
        else {
            this.selparam.setSousTable(this.input_table);
            this.selparam.setIdtoup(this.input_selid);
            switch (this.input_table) {
                case 'relgrpoptart':
                    this.selparam.setTable('article');
                    break;
                case 'option':
                    this.selparam.setTable('groupeopt');
                    break;
                default:
                    break;
            }
            this.router.navigate(['admin/update/soustable'], { replaceUrl: true });
        }
    }




}




