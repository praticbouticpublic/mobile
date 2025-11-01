import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform } from '@ionic/angular/standalone';
import { GetbackService } from 'src/app/getback.service';
import { StorageService } from '../../storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import * as myGlobals from '../../global';
import {HeaderService} from "../../header.service";
import {IonicModule} from "@ionic/angular";
import {ViewrecordPage} from "../../displaytable/viewrecord/viewrecord.page";
import {SelparamService} from "../../selparam.service";
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import {SubmitBase} from "../../submitbase";
import {FormBuilder} from "@angular/forms";
import {PresentationtableComponent} from "../../components/presentationtable/presentationtable.component";
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {PresentationrecordComponent} from "../../components/presentationrecord/presentationrecord.component";


@Component({
    selector: 'app-detailsorder',
    templateUrl: './detailsorder.page.html',
    styleUrls: ['./detailsorder.page.scss'],
    imports: [IonicModule, ViewrecordPage, PresentationtableComponent, DisplaytablePage, PresentationrecordComponent]
})

export class DetailsorderPage extends SubmitBase implements OnInit {

    cmdid = 0;
    champs: any[];
    liste: any[][];
    nomchamps: any[];
    valeurs: any[];
    numtable: any;
    bouticid: any;
    total: any;
    table = 'commande';
    selcol: any;
    selid: any;
    donnees: any;
    pagination: any;
    limite: any;
    offset: any;
    latable: any;
    rpp = [5, 10, 15, 20, 50, 100];
    vue: any;
    place: any;
    activepage: any;
    loading= true;
    myTitle ='';
    action = 'view';

    constructor(public router: Router, public menuCtrl: MenuController, public getback: GetbackService,
                public httpClient: HttpClient, public alertController: AlertController, public platform: Platform,
                public storage: StorageService, public model: ModeleService, public global: GlobalService,
                public header:HeaderService, public selparam: SelparamService, public formAction: FormBuilder)
    {
        super(model, storage, getback, router, selparam, alertController, httpClient, header, global, formAction);
        addIcons({ closeOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.storage.set('lasturl', this.router.url);
        this.selparam.setTable(this.table);
        this.selparam.getCmdid().then(cmdid => {
            this.cmdid = cmdid;
            this.selid = 0;
            this.selcol = '';
            this.input_table = this.table;
            this.input_selcol = this.selcol;
            this.input_selid = this.selid;
            this.input_id = this.cmdid;
            this.input_action = this.action;
            super.initialize().then(() => {
                this.numtable = this.model.getnumtable(this.table);
                this.myTitle = 'Détails ' + this.model.getTable(this.numtable).desc;
                this.loading = false;
            });
        });

        this.getback.getObservable().subscribe((data) => {
            if (data === 'orderlines') {
                this.global.setFormComponent(this);
            }
        });
    }

    ionViewDidEnter()
    {
        this.storage.set('lasturl', this.router.url);
        this.selparam.setTable(this.table);
        this.selparam.getCmdid().then(cmdid => {
            this.cmdid = cmdid;
            this.numtable = this.model.getnumtable(this.table);
            this.myTitle = 'Détails ' + this.model.getTable(this.numtable).desc;
            this.loading = false;
        });
    }

    goToOrderLinesPage(idlncmd: any) {
        this.router.navigate(['admin/orderlines'], { replaceUrl: false });
    }

    goBack() {
        this.getback.publishGetback('detailsorder');
        this.router.navigate(['admin/orders'], { replaceUrl: true });
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème API',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    reconnect() {
        this.storage.set('status', 'error');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    gotoUpperPage() {
        this.goBack();
    }

    /*async detail(bouticid: any, numtable: any, idtoup: any, limite: any, offset: any) {
        this.champs = this.model.getTable(this.numtable).champs;

        let i = -1;
        this.liste = new Array(this.champs.length);
        this.nomchamps = new Array(this.champs.length);
        this.valeurs = new Array(this.champs.length);
        for (const ch of this.champs) {
            i++;
            this.liste[i] = new Array();
            if (ch.typ === 'fk') {
                for (const element of this.model.getLiens()) {
                    if ((element.srctbl === this.model.getTable(this.numtable).nom) && (element.srcfld === this.champs[i].nom)) {
                        this.nomchamps[i] = element.desc;
                        for (const tbl of this.model.getTables()) {
                            if (tbl.nom === element.dsttbl) {
                                const ii = i;
                                const obj = {
                                    bouticid, tables: this.model.getTables(), table: tbl.nom,
                                    liens: this.model.getLiens(), colonne: tbl.cs + ', couleur'
                                };
                                this.httpClient.post(environment.apiroot + 'remplir-options', obj, await this.header.buildHttpOptions()).subscribe({
                                    next: (data: any) => {
                                        let l = -1;
                                        let k = -1;
                                        for (const donnee of (data as any[])) {
                                            l++;
                                            this.liste[ii].push(new Object({
                                                id: donnee[0], valeur: donnee[1],
                                                couleur: (donnee.length >= 2) ? donnee[2] : null
                                            }));
                                            if (donnee.length >= 2) {
                                                k++;
                                                const css = '.optbackcolor' + k + '{background-color:' + donnee[2] + '; color: ' + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const css2 = '.optbackcolor' + k + ' > div.alert-button-inner > div.alert-radio-label { background-color:' + donnee[2] + '; color: '
                                                    + ((this.luminosite(donnee[2]) > 127) ? 'black' : 'white') + '}';
                                                const head = document.getElementsByTagName('head')[0];
                                                const style = document.createElement('style');
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
                this.nomchamps[i] = ch.desc;
            }
        }
        const obj2 = { bouticid, table: this.model.getTable(this.numtable).nom, colonne: '', row: '', idtoup: idtoup };
        this.httpClient.post(environment.apiroot + 'get-values', obj2, await this.header.buildHttpOptions()).subscribe({
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
                            this.valeurs[i] = data[i];
                            break;
                        case 'date':
                            const event = new Date(Date.parse(data[i]));
                            this.valeurs[i] = event.toLocaleString('fr-FR');
                            break;
                        case 'bool':
                            this.valeurs[i] = (data[0][i] === '1') ? 'oui' : 'non';
                            break;
                        case 'prix':
                            this.valeurs[i] = parseFloat(data[i]).toFixed(2) + ' €';
                            break;
                        case 'fk':
                            for (let lien of this.model.getLiens()) {
                                if ((lien.srctbl === this.model.getTable(this.numtable).nom) && (lien.srcfld === champ.nom)) {
                                    for (let list of this.liste[i]) {
                                        if (list.id === data[i]) {
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

        this.gettable(this.bouticid, 'table10', 'table10', 'lignecmd', 5, 0, 'cmdid', this.id);

    }*/

    onStatutChange(event: Event, numero: any) {
        let leselect = ((event as CustomEvent).target as HTMLIonSelectElement);
        leselect.disabled = true;
        let row = [];
        const col = { nom: 'statid', valeur: leselect.value, type: 'fk' };
        row.push(col);
        this.model.updaterow(this.bouticid, this.model.getTable(this.numtable).nom, row, 'cmdid', this.cmdid, this);

        this.sendStatutSMS(this.bouticid, this.cmdid);
        let couleur: any;
        for (let optelem of this.liste[numero]) {
            if (leselect.value === optelem.id) {
                couleur = optelem.couleur;
                break;
            }
        }

        leselect.style.backgroundColor = couleur;
        leselect.style.color = (this.luminosite(couleur) > 127) ? 'black' : 'white';
        leselect.disabled = false;
    }

    luminosite(couleur: any) {
        const r = parseInt(couleur.slice(1, 3), 16);
        const g = parseInt(couleur.slice(3, 5), 16);
        const b = parseInt(couleur.slice(5, 7), 16);
        return (r + g + b) / 3;
    }

    async sendSMS(bouticid: any, telephone: any, message: any) {
        const obj = { bouticid, telephone, message };
        this.httpClient.post(environment.apiroot + 'send-sms', obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => { },
            error: (err: any) => { this.presentAlert(err.error.error); }
        });
    }

    async sendStatutSMS(bouticid: any, cmdid: any) {
        const obj = { bouticid, table: "commande", cmdid };
        this.httpClient.post(environment.apiroot + "send-sms", obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => this.sendSMS(bouticid, data.data[0], data.data[1]), error: (err: any) => this.reconnect()
        });
    }

    async gettable(bouticid: any, vue: any, place: any, table: any, limite: any, offset: any, selcol: any, selid: any) {
        this.selid = selid;
        this.selcol = selcol;
        (await this.model.getRowCount(bouticid, table, selcol, selid, null)).subscribe({
            next: async (data: any) => {
                this.total = +data[0];

                let pagination = true;
                if (this.total <= myGlobals.deflimite) {
                    limite = this.total;
                    offset = 0;
                    pagination = false;
                }
                else {
                    pagination = true;
                }

                this.activepage = offset / limite + 1;

                (await this.model.getData(bouticid, table, limite, offset, selcol, selid, null)).subscribe({
                    next: (data: any) => {
                        this.donnees = data.data;
                        this.pagination = pagination;
                        this.limite = limite;
                        this.offset = offset;
                        this.loading = false;
                    }, error: (err: any) => {
                        this.presentAlert(err.error.error);
                        this.reconnect();
                    }
                });

            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
                this.reconnect();
            }
        });
    }

    getPrice(price: any) {
        return parseFloat(price).toFixed(2);
    }

    getFrenchDate(date: any): any {
        const event = new Date(Date.parse(date));
        return event.toLocaleString('fr-FR');
    }

    onClickCellVal(event: Event, index: any) {
        this.goToOrderLinesPage(this.donnees[index][0]);
    }

    onChangeNbRes(event: Event) {
        this.activepage = 1;
        const elem = (event as CustomEvent).target as HTMLIonSelectElement;
        this.changeFunc(this.bouticid, this.vue, this.place, this.table, elem.value, this.selcol, this.selid);
        localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_rppid' + this.model.getnumtable(this.table), elem.value);
        if (this.selid == 0)
            localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(this.table), myGlobals.defoffset.toString());
    }

    changeFunc(bouticid: any, vue: any, place: any, tablestr: any, $i: any, selcol: any = '', selid: any = 0) {
        let limite = $i;
        this.gettable(bouticid, vue, place, tablestr, limite, 0, selcol, selid);
    }

    onPrevLinkClick(event: Event) {
        this.activepage--;
        if ((this.offset - this.limite) >= 0) {
            this.gettable(this.bouticid, this.vue, this.place, this.table, this.limite, ((this.activepage - 1) * this.limite), this.selcol, this.selid);
            if (this.selid == 0)
                localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(this.table), (this.offset - this.limite).toString());
        }
    }

    getTotalPage() {
        return (this.limite > 0) ? Math.ceil(this.total / this.limite) : 0;
    }

    onPageLinkClick(event: Event, k: any) {
        if (k !== this.activepage) {
            this.gettable(this.bouticid, this.vue, this.place, this.table, this.limite, ((k - 1) * this.limite), this.selcol, this.selid);
            if (this.selid == 0)
                localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(this.table), ((k - 1) * this.limite).toString());
        }
    }

    onNextLinkClick(event: Event) {
        this.activepage++;
        if ((this.offset - this.limite) < this.total) {
            this.gettable(this.bouticid, this.vue, this.place, this.table, this.limite, ((this.activepage - 1) * this.limite), this.selcol, this.selid);
            if (this.selid == 0)
                localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(this.table), (this.offset + this.limite).toString());
        }
    }


}
