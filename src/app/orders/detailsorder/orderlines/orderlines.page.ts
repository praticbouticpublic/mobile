
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { GetbackService } from 'src/app/getback.service';
import { Location } from '@angular/common';
import { StorageService } from '../../../storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../../global.service';
import * as myGlobals from '../../../../app/global';
import { addIcons } from "ionicons";
import { returnDownBackOutline } from "ionicons/icons";
import {HeaderService} from "../../../header.service";
import {ViewrecordPage} from "../../../displaytable/viewrecord/viewrecord.page";
import {SelparamService} from "../../../selparam.service";
import {IonicModule} from "@ionic/angular";
import {SubmitBase} from "../../../submitbase";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-orderlines',
    templateUrl: './orderlines.page.html',
    styleUrls: ['./orderlines.page.scss'],
    imports: [IonicModule, ViewrecordPage]
})

export class OrderlinesPage extends SubmitBase implements OnInit {

    lignecmdid = 0;
    liste: any[][] = new Array();
    champs: any;
    numtable: any;
    nomchamps: any[];
    valeurs: any[];
    loading = true;
    table = 'lignecmd';
    activepage = 1;
    myTitle = '' ;

    constructor(public router: Router, public menuCtrl: MenuController, public getback: GetbackService, public httpClient: HttpClient,
        public location: Location, public alertController: AlertController, public platform: Platform, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public header:HeaderService, public selparam:SelparamService,
        public formAction: FormBuilder)
    {
        super(model, storage, getback, router, selparam, alertController, httpClient, header, global, formAction);
        this.global.setFormComponent(this);
        addIcons({ returnDownBackOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = this.model.getTableParNom(this.table).desc;
        this.selparam.setTable(this.table);
        this.selparam.setSelcol('cmdid');
        this.selparam.getLigneCmdid().then(lignecmdid => {
            this.lignecmdid = lignecmdid;
            this.loading = false;
        });

        /*this.storage.get('bouticid').then(bouticid => {
            this.detail(bouticid, id);
        });*/
    }

    ionViewDidEnter() {
        /*this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(true);*/
    }

    goBack() {
        this.getback.publishGetback('orderlines');
        this.router.navigate(['admin/detailsorder'], { replaceUrl: true });
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

    /*async detail(bouticid: any, idtoup: any) {
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
                                    liens: this.model.getLiens(), colonne: tbl.cs
                                };
                                this.httpClient.post(environment.apiroot + 'remplir-options', obj, await this.header.buildHttpOptions()).subscribe({
                                    next: (data: any) => {
                                        let l = -1;
                                        for (const donnee of (data as any[])) {
                                            l++;
                                            this.liste[ii].push(new Object({
                                                id: donnee[0], valeur: donnee[1],
                                                couleur: (donnee.length > 2) ? donnee[2] : null
                                            }));
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

        const obj = { bouticid, table: this.model.getTable(this.numtable).nom, colonne: "", row: "", idtoup };

        this.httpClient.post(environment.apiroot + "get-values", obj, await this.header.buildHttpOptions()).subscribe({
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
                            this.valeurs[i] = (data[0][i] === "1") ? 'oui' : 'non';
                            break;
                        case 'prix':
                            this.valeurs[i] = parseFloat(data[i]).toFixed(2) + " €";
                            break;
                        case 'fk':
                            for (let lien of this.model.getLiens()) {
                                if ((lien.srctbl === this.model.getTable(this.numtable).nom) && (lien.srcfld === champ.nom)) {
                                    for (let list of this.liste[i]) {
                                        if (list.id === data[i]) {
                                            this.valeurs[i] = list.valeur;
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
    }*/
}
