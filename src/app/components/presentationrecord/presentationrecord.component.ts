import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { GetbackService } from 'src/app/getback.service';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import iro from '@jaames/iro';
import { ModeleService } from 'src/app/modele.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { strings } from 'src/app/strings';
import * as myGlobals from '../../../app/global';
import { InitSession } from 'src/app/initsession';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import {HeaderService} from "../../header.service";


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
    standalone: false,
})

export class PresentationrecordComponent implements OnInit {

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    statusAlertOptions: any = {
        cssClass: 'statusAlertCss',
    };


    myTitle = '';
    loaded = false;
    numtable: any;
    form: FormGroup;
    champs: any;
    bouticid: any;
    noimage: any;
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    liste: any[][] = new Array();
    valeurs: any[];
    elemimage: any;
    eleminpimg: any;
    elemclose: any;
    formloaded = false;
    isSubmitted = false;
    imgtruefilename = '';
    logoloaded = true;
    nomliens: any[];
    colorcode: any;
    colorpicker: any = null;
    imagesrc = '';
    lastactive: boolean;
    listimg: recimage[] = new Array();
    listimgvis: recimage[] = new Array();
    latable: any;
    rpp = [5, 10, 15, 20, 50, 100];

    constructor(public router: Router, public menuCtrl: MenuController, public location: Location,
        public getback: GetbackService, public alertController: AlertController, public platform: Platform,
        public storage: StorageService, public httpClient: HttpClient, public formAction: FormBuilder,
        public model: ModeleService, public global: GlobalService, public msg: MessageService, public session: InitSession,
        public header:HeaderService) {
        this.form = this.formAction.group({});
        if (this.table === 'commande')
            this.latable = this.model.getTableParNom('lignecmd');
    }

    @Input() action: string;
    @Input() table: string;
    @Input() selcol: string;
    @Input() selid: number;
    @Input() id: number;

    get errorControl() {
        return this.form.controls;
    }

    errorControlfield(index: any) {
        return this.form.get(index);
    }

    async genValeursLiens()
    {
        let i = -1;
        this.liste = new Array(this.champs.length);
        this.nomliens = new Array(this.champs.length);
        this.valeurs = new Array(this.champs.length);
        for (const ch of this.champs) {
            i++;
            this.liste[i] = new Array();
            if (ch.typ === 'fk') {
                for (const element of this.model.getLiens()) {
                    if ((element.srctbl === this.model.getTable(this.numtable).nom) && (element.srcfld === this.champs[i].nom)) {
                        this.nomliens[i] = element.desc;
                        for (const tbl of this.model.getTables()) {
                            if (tbl.nom === element.dsttbl) {
                                const ii = i;
                                const obj = {
                                    bouticid: this.bouticid,
                                    table: tbl.nom,
                                    colonne: tbl.cs + ((element.nom === 'statut') ? ', couleur' : '')
                                };

                                this.httpClient.post<any>(this.apiroot + 'remplir-options', obj, await this.header.buildHttpOptions()).subscribe({
                                    next: async (data: any) => {
                                        let l = -1;
                                        let k = -1;
                                        for (const donnee of (data.results as any[])) {
                                            l++;
                                            this.liste[ii].push(new Object({
                                                id: donnee[0], valeur: donnee[1],
                                                couleur: (donnee.length > 2) ? donnee[2] : null
                                            }));
                                            if (donnee.length > 2) {
                                                k++;
                                                const css = '.optbackcolor' + k + '{background-color:' + donnee[2] + '; color: ' + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const css2 = '.optbackcolor' + k + ' > div.alert-button-inner > div.alert-radio-label { background-color:' + donnee[2] + '; color: '
                                                    + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const head = document.getElementsByTagName('head')[0];
                                                const style = document.createElement('style');
                                                //style.type = 'text/css';
                                                style.appendChild(document.createTextNode(css));
                                                style.appendChild(document.createTextNode(css2));
                                                head.appendChild(style);

                                            }
                                        }
                                    },
                                    error: (err: any) => this.reconnect()
                                });
                            }
                        }
                    }
                }
            }
            else {
                this.nomliens[i] = ch.desc;
            }
        }
        const obj2 = { bouticid: this.bouticid, table: this.model.getTable(this.numtable).nom, colonne: '', row: '', idtoup: this.id };

        this.httpClient.post<any>(this.apiroot +  'get-values', obj2, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                let i = -1;
                for (let champ of this.champs) {
                    i++;
                    switch (champ.typ) {
                        case 'text':
                        case 'ref':
                        case 'image':
                        case 'pass':
                        case 'email':
                        case 'codepostal':
                        case 'couleur':
                            this.valeurs[i] = data.values[i];
                            break;
                        case 'date':
                            const event = new Date(Date.parse(data.values[i]));
                            this.valeurs[i] = event.toLocaleString('fr-FR');
                            break;
                        case 'bool':
                            this.valeurs[i] = (data.values[i] === '1') ? 'oui' : 'non';
                            break;
                        case 'prix':
                            this.valeurs[i] = parseFloat(data.values[i]).toFixed(2) + ' €';
                            break;
                        case 'fk':
                            for (let lien of this.model.getLiens()) {
                                if ((lien.srctbl === this.model.getTable(this.numtable).nom) && (lien.srcfld === champ.nom)) {
                                    for (let list of this.liste[i]) {
                                        if (list.id === data.values[i]) {
                                            this.valeurs[i] = list;
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }
            },
            error: (err: any) => {
                this.reconnect();
            }
        });

    }

    genValeursparDefaut()
    {
        this.storage.get('bouticid').then(async bouticid => {
            const obj = {
                bouticid, action: 'getvalues', table: this.model.getTable(this.numtable).nom, colonne: '',
                row: '', idtoup: this.id
            };
            this.httpClient.post(this.apiroot + 'get-values', obj, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.formloaded = true;
                    let k = -1;
                    for (const champ of this.champs) {
                        k++;
                        const l = k;
                        if (champ.typ !== 'pk') {
                            this.storage.get('mem_fld_' + l).then(defval => {
                                if (defval === null) {
                                    switch (this.action) {
                                        case 'insert':
                                            defval = champ.defval;
                                            break;
                                        case 'update':
                                            defval = data.values[l];
                                            break;
                                    }

                                }
                                if (champ.typ === 'image') {
                                    if ((defval !== null) && (defval !== '')) {
                                        this.imagesrc = environment.srvroot + 'upload/' + defval;
                                        this.imgtruefilename = defval;
                                        this.storage.set('mem_fld_' + l, defval);
                                    }
                                    else {
                                        this.imagesrc = '';
                                        this.imgtruefilename = '';
                                        this.storage.remove('mem_fld_' + l);
                                    }
                                }
                                else if (defval !== null) {
                                    if (champ.typ === 'bool') {
                                        this.form.get(l.toString()).setValue((defval.toString() === '1'));
                                    }
                                    else if (champ.typ === 'fk') {
                                        if (this.selcol !== champ.nom) {
                                            this.form.get(l.toString()).setValue(defval);
                                        }
                                    }
                                    else if (champ.typ === 'couleur') {
                                        this.form.get(l.toString()).setValue(defval);
                                        const coul = (defval !== '') ? defval : '#FFF';
                                        if (this.colorpicker === null) {
                                            this.colorpicker = iro.ColorPicker('#picker', { width: 160, color: coul });
                                            this.colorpicker.on('color:change', (color: any) => {
                                                this.global.getFormComponent().form.get(l.toString()).setValue(color.hexString);
                                            });
                                        }
                                    }
                                    else {
                                        this.form.get(l.toString()).setValue(defval);
                                    }
                                }
                            });
                        }
                    }
                }, error: (err: any) => this.reconnect()
            });
        });
    }


    ngOnInit() {
        this.numtable = this.model.getnumtable(this.table);
        this.champs = this.model.getTable(this.numtable).champs;
        for (let h = 0; h < this.champs.length; h++) {
            this.form.addControl(h.toString(), new FormControl());
        }

        this.storage.get('mem_bouticid').then(mbouticid => {
            this.storage.get('mem_operation').then(op => {
                this.storage.get('mem_table').then(table => {
                    this.storage.get('mem_idtoup').then(idtoup => {
                        this.storage.get('mem_selcol').then(selcol => {
                            this.storage.get('mem_selid').then(selid => {
                                this.storage.get('bouticid').then(async bouticid => {
                                    this.bouticid = bouticid;
                                    if (table !== null) {
                                        if ((bouticid !== this.bouticid) || (op !== this.action) || (table !== this.table) || (+idtoup !== this.id) ||
                                            (selcol !== this.selcol) || (+selid !== this.selid)) {
                                            for (let ij = 0; ij < this.model.getTable(this.numtable).champs.length; ij++) {
                                                this.storage.remove('mem_fld_' + ij);
                                            }
                                        }
                                    }
                                    this.storage.set('mem_bouticid', this.bouticid);
                                    this.storage.set('mem_operation', this.action);
                                    this.storage.set('mem_table', this.table);
                                    this.storage.set('mem_idtoup', this.id);
                                    this.storage.set('mem_selcol', this.selcol);
                                    this.storage.set('mem_selid', this.selid);

                                    this.genValeursLiens();

                                    if (this.selcol === 'none') {
                                        this.selcol = '';
                                    }
                                    if ((this.table === 'article') && (this.action === 'update')) {
                                        (await this.model.getData(this.bouticid, "artlistimg", environment.maximage, 0, "artid", this.id, null)).subscribe({
                                            next: (data: any) => {
                                                for (let di of data.data) {
                                                    let img = { pkid: +di[0], artid: this.id, bouticid: +this.bouticid, filename: di[2], favori: (di[3].toString() === '1'), visible: (di[4].toString() === '1') };
                                                    if (img.visible === true) {
                                                        this.listimgvis.push(img as recimage);
                                                        this.listimg.push(img as recimage);
                                                    }
                                                }
                                            }, error: (err: any) => {
                                                this.presentAlert(err.error.error);
                                                this.reconnect();
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });

        this.msg.init();
        this.msg.getObservable().subscribe(async (event) => {
            if ((event === 'UpdateEnter') || (event === 'InsertEnter') || (event === 'ViewEnter')) {
                this.global.setFormComponent(this);
                this.loaded = true;
                this.formloaded = true;
                this.genValeursparDefaut();
            }
            if (event === 'submitUpdate')
                this.onSubmitAction(event, 'update');
            if (event === 'submitInsert')
                this.onSubmitAction(event, 'insert');
        });
    }

    goBack() {
        this.getback.publishGetback({ table: this.table, action: this.action + 'record' });
        if (this.selid === 0) {
            this.selcol = 'none';
            if ((this.table === 'categorie') || (this.table === 'article') || (this.table === 'groupeopt')) {
                this.router.navigate(['admin/products/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
            }
            else if ((this.table === 'barlivr') || (this.table === 'cpzone')) {
                this.router.navigate(['admin/deliveries/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
            }
            else if (this.table === 'statutcmd') {
                this.router.navigate(['admin/customerarea/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
            }
            else if (this.table === 'promotion') {
                this.router.navigate(['admin/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
            }
        }
        else {
            this.router.navigate(['admin/update/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
        }
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Error,
            subHeader: strings.APITrouble,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    reconnect() {
        this.storage.set('status', 'error');
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    luminosite(couleur: any) {
        const r = parseInt(couleur.slice(1, 3), 16);
        const g = parseInt(couleur.slice(3, 5), 16);
        const b = parseInt(couleur.slice(5, 7), 16);
        return (r + g + b) / 3;
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
                    this.listimgvis.push(img as recimage);
                    this.listimg.push(img as recimage);
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
        this.listimg[i].visible = false;
        this.listimgvis.splice(i, 1);
    }

    onChangeFavImg(i: number) {
        let favoristatus = this.listimgvis[i].favori;
        for (let imgvis of this.listimgvis) {
            imgvis.favori = false;
        }
        for (let img of this.listimg) {
            img.favori = false;
        }
        this.listimgvis[i].favori = !favoristatus;
        if (this.listimgvis[i].pkid !== 0) {
            for (let img of this.listimg) {
                if (this.listimgvis[i].pkid === img.pkid) {
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
        this.loaded = true;
        this.formloaded = true;
        this.genValeursparDefaut();
    }

    onStatutChange(event: Event, numero: any) {
        let leselect = ((event as CustomEvent).target as HTMLIonSelectElement);
        leselect.disabled = true;
        let row = [];
        const col = { nom: 'statid', valeur: leselect.value, type: 'fk' };
        row.push(col);
        this.model.updaterow(this.bouticid, this.model.getTable(this.numtable).nom, row, 'cmdid', this.id, this);

        this.sendStatutSMS(this.bouticid, this.id);
        let couleur: any;
        for (let optelem of this.liste[numero]) {
            if (leselect.value === optelem.id) {
                couleur = optelem.couleur;
                break;
            }
        }

        leselect.style.backgroundColor = couleur;
        leselect.style.color = (this.luminosite((couleur == null) ? '#FFFFFF' : couleur) > 127) ? 'black' : 'white';
        leselect.disabled = false;
        this.msg.publishMessage('refresh');
    }

    async sendSMS(bouticid: any, telephone: any, message: any) {
        const obj = { bouticid, telephone, message };
        this.httpClient.post(environment.apiroot + 'send-sms', obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => { },
            error: (err: any) => this.presentAlert(err.error.error)
        });
    }

    async sendStatutSMS(bouticid: any, cmdid: any) {
        const obj = { bouticid, table: "commande", cmdid };

        this.httpClient.post(environment.apiroot + "get-com-data", obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => this.sendSMS(bouticid, data[0], data[1]), error: (err: any) => this.reconnect()
        });
    }

    async onSubmitAction(event: Event, act: string) {
        this.isSubmitted = true;
        if (!this.form.valid) {
            this.loaded = true;
            return false;
        }
        const row = [];
        let pknom: any;
        const error = false;
        const errmsg = '';
        let j = -1;
        for (const champ of this.champs) {
            j++;
            let val: any;
            if (champ.typ === 'image') {
                val = this.imgtruefilename;
            }
            else if (champ.typ === 'bool') {
                val = this.form.get(j.toString()).value ? '1' : '0';
            }
            else if (champ.typ === 'fk') {
                val = (this.selcol === champ.nom) ? this.selid : this.form.get(j.toString()).value;
            }
            else if (champ.typ !== 'pk') {
                val = this.form.get(j.toString()).value;
                this.storage.remove('mem_fld_' + j);
            }
            else {
                pknom = champ.nom;
            }
            if (champ.typ !== 'pk') {
                const col = { nom: champ.nom, valeur: val, type: champ.typ, desc: champ.desc };
                row.push(col);
            }
        }
        if (error === false) {
            if (act === 'update') {
                this.model.updaterow(this.bouticid, this.model.getTable(this.numtable).nom, row, pknom, this.id, this);
                this.appendImgtoBd();
                this.goBack();
            }
            else if (act === 'insert') {
                (await this.model.insertrow(this.bouticid, this.model.getTable(this.numtable).nom, row)).subscribe({
                    next: (response: any) => {
                        this.id = +response.id;
                        this.appendImgtoBd();
                        this.goBack();
                    }, error: (err: any) => {
                        this.presentAlert(err.error.error);
                        this.loaded = true;
                    }
                });
            }
        }
        else {
            this.presentAlert(errmsg);
        }
    }

    async appendImgtoBd() {
        if (this.model.getTable(this.numtable).nom === 'article') {
            for (let img of this.listimg) {
                let numlstimg = this.model.getnumtable('artlistimg');
                let champslstimg = this.model.tables[numlstimg].champs;
                let row = [];

                for (let i = 0; i < champslstimg.length; i++) {
                    let val = '';
                    if (champslstimg[i].nom === 'artid') {
                        val = this.id.toString();
                    }
                    else if (champslstimg[i].nom === 'image') {
                        val = img.filename;
                    }
                    else if (champslstimg[i].nom === 'favori') {
                        val = img.favori ? '1' : '0';
                    }
                    else if (champslstimg[i].nom === 'visible') {
                        val = img.visible ? '1' : '0';
                    }
                    if (champslstimg[i].typ !== 'pk') {
                        let col = { nom: champslstimg[i].nom, valeur: val, type: champslstimg[i].typ, desc: champslstimg[i].desc };
                        row.push(col);
                    }
                }
                if (img.pkid === 0) {
                    (await this.model.insertrow(this.bouticid, 'artlistimg', row)).subscribe(() => {
                    }, err => {
                        this.presentAlert(err.error.error);
                        this.reconnect();
                    });
                }
                else {
                    this.model.updaterow(this.bouticid, 'artlistimg', row, 'artlistimgid', img.pkid, this);
                }
            }
        }
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

}




