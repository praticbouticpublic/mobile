import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { GetbackService } from 'src/app/getback.service';
import { ModeleService } from '../modele.service';
import { StorageService } from '../storage.service';
import { addIcons } from "ionicons";
import { pencilOutline, linkOutline } from "ionicons/icons";
import {SelparamService} from "../selparam.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-update',
    templateUrl: './update.page.html',
    styleUrls: ['./update.page.scss'],
    imports: [IonicModule]
})
export class UpdatePage implements OnInit {

    table = '';
    id = 0;
    selid = 0;
    selcol = '';

    sstablenom = '';
    ssid = 0;
    ssselid = 0;
    ssselcol = '';

    sstable = '';
    loading =false;

    constructor(public router: Router, public getback: GetbackService, public platform: Platform, public storage: StorageService,
        public model: ModeleService, public selparam:SelparamService) {
        const theurl = this.router.url;
        const nexslash = this.router.url.indexOf('/', 1) + 1;
        let zeroparturl: string;
        let firstparturl: string;
        let secondparturl: string;
        let next2slash: any;
        if (nexslash > 0) {
            zeroparturl = theurl.substring(1, nexslash - 1);
            const nextslash = this.router.url.indexOf('/', nexslash) + 1;
            if (nextslash > 0) {
                firstparturl = theurl.substring(nexslash, nextslash - 1);
                next2slash = this.router.url.indexOf('/', nextslash) + 1;
                if (next2slash > 0) {
                    secondparturl = theurl.substring(nextslash, next2slash - 1);
                }
                else {
                    secondparturl = theurl.substring(nextslash);
                }
            }
            else {
                firstparturl = theurl.substring(1);
            }
        }
        if (secondparturl === 'updaterecord') {
            let thirdparturl: string;
            let fourthparturl: string;
            const next3slash = this.router.url.indexOf('/', next2slash) + 1;
            if (next3slash > 0) {
                thirdparturl = theurl.substring(next2slash, next3slash - 1);
                const next4slash = this.router.url.indexOf('/', next3slash) + 1;
                if (next4slash > 0) {
                    fourthparturl = theurl.substring(next3slash, next4slash - 1);
                }
                else {
                    fourthparturl = theurl.substring(next3slash);
                }
            }
            else {
                thirdparturl = theurl.substring(next2slash);
            }
            this.table = thirdparturl;
            this.id = +fourthparturl;
            this.sstable = this.model.getTableParNom(this.table).sstable;
            let numlnk: any;
            for (let i = 0; i < this.model.getLiens().length; i++) {
                if (this.model.getLiens()[i].nom === this.table) {
                    numlnk = i;
                }
            }
            for (const tbl of this.model.getTables()) {
                if (this.model.getLiens()[numlnk].srctbl === tbl.nom) {
                    this.sstablenom = tbl.nom;
                    this.ssid = this.id;
                    this.ssselcol = this.model.getLiens()[numlnk].srcfld;
                }
            }
        }
        else if (secondparturl === 'displaytable') {
            let thirdparturl: string;
            let fourthparturl: string;
            let fifthparturl: string;
            const next3slash = this.router.url.indexOf('/', next2slash) + 1;
            if (next3slash > 0) {
                thirdparturl = theurl.substring(next2slash, next3slash - 1);
                const next4slash = this.router.url.indexOf('/', next3slash) + 1;
                if (next4slash > 0) {
                    fourthparturl = theurl.substring(next3slash, next4slash - 1);
                    const next5slash = this.router.url.indexOf('/', next4slash) + 1;
                    if (next5slash > 0) {
                        fifthparturl = theurl.substring(next4slash, next5slash - 1);
                    }
                    else {
                        fifthparturl = theurl.substring(next4slash);
                    }
                }
                else {
                    fourthparturl = theurl.substring(next3slash);
                }
            }
            else {
                thirdparturl = theurl.substring(next2slash);
            }
            this.sstablenom = thirdparturl;
            this.ssselcol = fourthparturl;
            this.selid = +fifthparturl;
            let numlnk: any;
            for (let i = 0; i < this.model.getLiens().length; i++) {
                if ((this.model.getLiens()[i].srctbl === this.sstablenom) && (this.model.getLiens()[i].srcfld === this.ssselcol)) {
                    numlnk = i;
                }
            }
            this.table = this.model.getLiens()[numlnk].dsttbl;
            this.id = this.selid;
            this.ssid = this.id;
            this.sstable = 'o';

        }
        addIcons({ pencilOutline, linkOutline });


    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.selparam.getTable().then(table => {
            this.selparam.getSousTable().then(soustable => {
                this.selparam.getIdtoup().then(id => {
                    this.id = id;
                    this.selparam.getSelcol().then(selcol => {
                        this.selcol = selcol;
                        this.selparam.getSelid().then(selid => {
                            this.selid = selid;
                            !this.selid  ? this.table = table : this.table = soustable;
                            this.sstable = this.model.getTableParNom(this.table).sstable;
                            let numlnk: any;
                            if (this.sstable === 'o')
                            {
                                for (let i = 0; i < this.model.getLiens().length; i++) {
                                    if (this.model.getLiens()[i].nom === this.table) {
                                        numlnk = i;
                                    }
                                }
                                for (const tbl of this.model.getTables()) {
                                    if (this.model.getLiens()[numlnk].srctbl === tbl.nom) {
                                        this.sstablenom = tbl.nom;
                                        this.ssid = this.id;
                                        this.ssselcol = this.model.getLiens()[numlnk].srcfld;
                                        this.selparam.setSousTable(this.sstablenom);
                                        this.selparam.setSelid(this.ssid);
                                        this.selparam.setSelcol(this.ssselcol);

                                    }
                                }
                                this.loading = false;
                            }
                        })
                    })
                })

            })

        })

        this.getback.getObservable().subscribe((data) => {
            if (data === 'updaterecord') {
                const selid = +this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
                let str = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
                const selcol = str.substring(str.lastIndexOf('/') + 1);
                str = str.substring(0, str.lastIndexOf('/'));
                const id = +str.substring(str.lastIndexOf('/') + 1);
                str = str.substring(0, str.lastIndexOf('/'));
                const table = str.substring(str.lastIndexOf('/') + 1);
                const numtable = this.model.getnumtable(table);
                if (this.model.getTable(numtable).sstable === 'n') {
                    if (selid > 0) {
                        // retrouve le lien
                        this.sstable = 'o';
                        let numlnk: any;
                        for (let i = 0; i < this.model.getLiens().length; i++) {
                            if ((this.model.getLiens()[i].srctbl === this.model.getTable(numtable).nom) && (this.model.getLiens()[i].srcfld === this.model.getTable(numtable).selcol)) {
                                this.table = this.model.getLiens()[i].dsttable;
                                this.sstable = table;
                                this.ssid = selid;
                                this.ssselcol = selcol;
                                numlnk = i;
                            }
                        }
                    }
                    else {
                        this.sstable = 'n';
                    }
                }
            }
            else if (data === 'insertrecord') {
                const selid = +this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
                let str = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
                const selcol = str.substring(str.lastIndexOf('/') + 1);
                str = str.substring(0, str.lastIndexOf('/'));
                const table = str.substring(str.lastIndexOf('/') + 1);
                const numtable = this.model.getnumtable(this.table);
                if (this.model.getTable(numtable).sstable === 'n') {
                    if (selid > 0) {
                        this.sstable = 'o';
                        let numlnk: any;
                        for (let i = 0; i < this.model.getLiens().length; i++) {
                            if ((this.model.getLiens()[i].srctbl === this.model.getTable(numtable).nom) && (this.model.getLiens()[i].srcfld === this.model.getTable(numtable).selcol)) {
                                this.table = this.model.getLiens()[i].dsttable;
                                this.sstable = table;
                                this.ssid = selid;
                                this.ssselcol = selcol;
                                numlnk = i;
                            }
                        }
                    }
                    else {
                        this.sstable = 'n';
                    }
                }
            }
        });
    }

    ionViewDidEnter() {
        this.storage.set('lasturl', this.router.url);
    }

    ionViewWillLeave() {

    }

}
