import {Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform } from '@ionic/angular/standalone';
import { GetbackService } from '../../getback.service';
import { StorageService } from '../../storage.service';
import { ModeleService } from '../../modele.service';
import { GlobalService } from '../../global.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/message.service';
import { strings } from 'src/app/strings';
import { Observable } from 'rxjs';
import {HeaderService} from "../../header.service";
import {SelparamService} from "../../selparam.service";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe, PercentPipe} from "@angular/common";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from '@angular/forms';
import * as myGlobals from './../../global';

@Component({
    selector: 'app-presentationtable',
    templateUrl: './presentationtable.component.html',
    styleUrls: ['./presentationtable.component.scss'],
    imports: [IonicModule, NgbPagination, FormsModule, DecimalPipe, PercentPipe]
})

export class PresentationtableComponent {

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    statusAlertOptions: any = {
        cssClass: 'statusAlertCss',
    };

    data: any;
    notifid = 0;
    myTitle = '';
    page = 1;
    count = 0;
    tableSize = 5;
    id = 0;
    tableSizes: any = myGlobals.rpp;
    numtable: any;
    loaded = false;
    total: any;
    liens: any;
    donnees: any;
    pagination: any;
    limite = myGlobals.deflimite;
    latable: any;
    vue: any;
    place: any;
    rpp = [5, 10, 15, 20, 50, 100, 500];
    offset = myGlobals.defoffset;
    bouticid: any;
    activepage: any;
    w: any;
    tablestr = 'commande';
    colorready = false;
    couleur: any[];
    mediumTime: string;
    nbnewcmd = 0;

    constructor(private router: Router, public menuCtrl: MenuController, public getback: GetbackService, public httpClient: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public msg: MessageService,
        public header:HeaderService, public selparam : SelparamService) {

    }
    @Input() table: string;
    @Input() selcol: string;
    @Input() selid: number;
    @Input() writable: string;

    displayTable(bouticid: any) {
        if (this.selid === 0) {
            this.inittable(bouticid, 'table' + this.numtable, 'table' + this.numtable, this.table, '', 0);
        }
        else {
            this.gettable(bouticid, 'table' + this.numtable, 'table' + this.numtable, this.table, myGlobals.deflimite, myGlobals.defoffset, this.selcol,
                this.selid);
        }
        this.loaded = true;
    }

    async lireParamNewCmd(): Promise<Observable<any>> {
        const obj = { bouticid: this.bouticid, table: '', param: 'NEW_ORDER' };
        return this.httpClient.post<string>(environment.apiroot + 'get-param', obj, await this.header.buildHttpOptions());
    }

    async razParamNewCmd(): Promise<Observable<any>> {
        const obj = { bouticid: this.bouticid, table: '', param: 'NEW_ORDER', valeur: '0' };
        return this.httpClient.post<string>(environment.apiroot + 'set-param', obj, await this.header.buildHttpOptions());
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = this.model.getTableParNom(this.table).desc;
        this.latable = this.model.getTableParNom(this.table);
        this.liens = this.model.getLiens();
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.getback.getObservable().subscribe((data) => {
            this.global.setFormComponent(this);
                if (data.table === this.table) {
                 this.displayTable(this.bouticid);
            }
        });
        this.storage.get('bouticid').then(bouticid => {
            this.bouticid = bouticid;
            this.displayTable(this.bouticid);
            if (this.table === 'commande') {
                this.msg.init();
                this.msg.getObservable().subscribe(data => {
                    if (data === 'refresh') {
                        this.displayTable(this.bouticid);
                    }
                })
            }
        });
    }

    ngOnDestroy() {
        this.loaded = true;
    }

    goToUpdatePage(table: any, id: any, selcol: any, selid: any) {
        this.loaded = false;
        this.selparam.setAction('update');
        if (this.selid === 0) {
            this.selparam.setTable(table);
        }
        this.selparam.setIdtoup(id);
        if (this.model.getTableParNom(table).sstable === 'o')
        {
            this.router.navigate(['admin/update/updaterec'], { replaceUrl: true });
        }
        else if ((selcol === '') && (selid === 0))
        {
            this.router.navigate(['admin/displayrecord'], { replaceUrl: true });
        }
        else
        {
            this.router.navigate(['admin/displaysousrecord'], { replaceUrl: true });
        }

    }

    goToViewPage(table: any, id: any, selcol: any, selid: any) {
        this.loaded = true;
        this.selparam.setTable(table);
        this.selparam.setAction('view');

        if (this.table === 'commande') {
            this.selparam.setCmdid(id);
            this.router.navigate(['admin/detailsorder'], { replaceUrl: true });
        }
        else if (this.table === 'lignecmd')
        {
            this.selparam.setLigneCmdid(id);
            this.router.navigate(['admin/orderlines'], { replaceUrl: true });
        }
        else if ((selcol === '') && (selid === 0))
        {
            this.selparam.setIdtoup(id);
            this.router.navigate(['admin/displayrecord'], { replaceUrl: true });
        }
        else
        {
            this.selparam.setIdtoup(id);
            this.router.navigate(['admin/displaysousrecord'], { replaceUrl: true });
        }

    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: strings.APITrouble,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    reconnect() {
        this.loaded = false;
        this.storage.set('status', 'error');
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    removeFldMem(elem: any, table: any, idtoup: any) {
        this.storage.get('mem_operation').then(op => {
            if (op === 'update') {
                this.storage.get('mem_table').then(tbl => {
                    if (tbl === table) {
                        this.storage.get('mem_idtoup').then(id => {
                            if (+id === +idtoup) {
                                for (let i = 0; i < this.model.getTableParNom(table).champs.length; i++) {
                                    this.storage.remove('mem_fld_' + i);
                                }
                                this.storage.remove('mem_operation');
                                this.storage.remove('mem_table');
                                this.storage.remove('mem_idtoup');
                            }
                        });
                    }
                });
            }

        });
    }

    inittable(bouticid: any, vue: any, place: any, table: any, selcol: any, selid: any) {
        if (!localStorage.getItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_rppid' + this.model.getnumtable(table))) {
            localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_rppid' + this.model.getnumtable(table), myGlobals.deflimite.toString());
        } else {
            this.limite = +localStorage.getItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_rppid' + this.model.getnumtable(table));
        }
        if (selid === 0) {
            if (!localStorage.getItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(table))) {
                localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(table), myGlobals.defoffset.toString());
            } else {
                this.offset = +localStorage.getItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(table));
            }
        }
        else {
            this.offset = myGlobals.defoffset;
        }

        this.gettable(bouticid, vue, place, table, this.limite, this.offset, selcol, selid);
    }

    async gettable(bouticid: any, vue: any, place: any, table: any, limite: any, offset: any, selcol: any, selid: any) {
        (await this.model.getRowCount(bouticid, table, selcol, selid, myGlobals.filtres)).subscribe({
            next: async (data: any) => {
                this.total = +data.count;
                if (table === 'commande') {
                    (await this.lireParamNewCmd()).subscribe({
                        next: async (data: any) => {
                            this.nbnewcmd = +data.value;
                            let limited = myGlobals.deflimite;
                            let offseted = myGlobals.defoffset;
                            if (this.nbnewcmd > 0) {
                                limited = Number(this.rpp.find((element) => (((this.total % element) === 0) ? element : (this.total % element)) >= this.nbnewcmd));
                                offseted = this.total - ((this.total % limited) === 0 ? limited : (this.total % limited));
                            }
                            else {
                                limited = limite;
                                offseted = offset;
                            }
                            let pagination = true;
                            if (this.total <= myGlobals.deflimite) {
                                pagination = false;
                                this.activepage = offseted / limited + 1;
                                (await this.model.getData(bouticid, table, this.total, 0, selcol, selid, myGlobals.filtres)).subscribe({
                                    next: async (data: any) => {
                                        this.displaytablemobile(bouticid, vue, place, table, data.data, pagination, limited, offseted, selcol, selid);
                                        if (this.nbnewcmd > 0)
                                            (await this.razParamNewCmd()).subscribe({
                                                next: (data: string) => {
                                                    this.nbnewcmd = 0;
                                                }, error: (err: any) => {
                                                    return;
                                                }
                                            });
                                    }, error: (err: any) => {
                                        this.presentAlert(err.error.error);
                                        this.reconnect();
                                    }
                                });
                            }
                            else {
                                pagination = true;
                                this.activepage = offseted / limited + 1;
                                (await this.model.getData(bouticid, table, limited, offseted, selcol, selid, myGlobals.filtres)).subscribe({
                                    next: async (data: any) => {
                                        this.displaytablemobile(bouticid, vue, place, table, data.data, pagination, limited, offseted, selcol, selid);
                                        if (+data.count > 0)
                                            (await this.razParamNewCmd()).subscribe({
                                                next: (data: string) => {
                                                    this.nbnewcmd = 0;
                                                }, error: (err: any) => {
                                                    return;
                                                }
                                            });
                                    }, error: (err: any) => {
                                        this.presentAlert(err.error.error);
                                        this.reconnect();
                                    }
                                });
                            }
                        }, error: (err: any) => {
                            this.presentAlert(err.error.error);
                            this.reconnect();
                        }
                    });
                }
                else {
                    let pagination = true;
                    if (this.total <= myGlobals.deflimite) {
                        pagination = false;
                        this.activepage = 1;
                        (await this.model.getData(bouticid, table, this.total, 0, selcol, selid, myGlobals.filtres)).subscribe({
                            next: (data: any) => {
                                this.displaytablemobile(bouticid, vue, place, table, data.data, pagination, limite, offset, selcol, selid);
                            }, error: (err: any) => {
                                this.presentAlert(err.error.error);
                                this.reconnect();
                            }
                        });
                    }
                    else {
                        pagination = true;
                        this.activepage = offset / limite + 1;
                        (await this.model.getData(bouticid, table, limite, offset, selcol, selid, myGlobals.filtres)).subscribe({
                            next: (data: any) => {
                                this.displaytablemobile(bouticid, vue, place, table, data.data, pagination, limite, offset, selcol, selid);
                            }, error: (err: any) => {
                                this.presentAlert(err.error.error);
                                this.reconnect();
                            }
                        });
                    }
                }
            }, error: (err: any) => {
                this.presentAlert(err.error.error);
                this.reconnect();
            }
        });
    }

    async displaytablemobile(bouticid: any, vue: any, place: any, tablestr: any, donnees: any, pagination: any, limite: any, offset: any, selcol: any, selid: any) {
        let pkval: any;
        this.selcol = selcol;
        this.donnees = donnees;
        this.pagination = pagination;
        this.couleur = new Array(this.limite);
        this.couleur.splice(0);
        for (let i = 0; i < this.limite; i++) {
            this.couleur.push('#FFFFF');
        }

        if (this.tablestr == 'commande') {
            const obj3 = { bouticid, table: '', colonne: '', row: '', idtoup: '', limite: this.limite, offset: this.offset, selcol: '', selid: 0 };

            this.httpClient.post(environment.apiroot + 'color-row', obj3, await this.header.buildHttpOptions()).subscribe({
                next: (response: any) => {
                  const data = response.colors;
                  if (data.length > 0)
                      for( let i=0; i<data.length; i++)
                          this.couleur[i] = data[i][0];
                  this.colorready = true;
                },
                error: (err: any) => {
                    this.presentAlert(err.error.error);
                    this.reconnect();
                }
            });
        }
    }

    onClickCellVal(event: Event, index: any) {
        this.selparam.setTable(this.table);
        this.selparam.setSelid(this.selid);
        this.selparam.setSelcol(this.selcol);
        if (this.writable === 'true') {
            this.selparam.setAction('update');
            this.goToUpdatePage(this.table, this.donnees[index][0], this.selcol, this.selid);
        }
        else {
            this.selparam.setAction('view');
            this.goToViewPage(this.table, this.donnees[index][0], this.selcol, this.selid);
        }
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
        this.limite = $i;
        this.offset = 0;
        this.gettable(bouticid, vue, place, tablestr, this.limite, this.offset, selcol, selid);
    }

    getTotalPage() {
        return (this.limite > 0) ? Math.ceil(this.total / this.limite) : 0;
    }

    onCheckCell(event: any, noligne: any, nocol: any) {
        let champs = this.model.getTable(this.numtable).champs;
        let champ: any;
        let row = new Array();
        let pknom: any;
        let val = (event.target.checked) ? '0' : '1';;
        for (let a = 0; a < champs.length; a++) {
            if (a === nocol)
                champ = champs[a];

            if (champs[a].typ === 'pk')
                pknom = champs[a].nom;
        }
        const col = { nom: champ.nom, valeur: val, type: champ.typ, desc: champ.desc };
        row.push(col);
        this.model.updaterow(this.bouticid, this.table, row, pknom, this.donnees[noligne][0], this)
    }

    luminosite(couleur: any)
    {
        const r = parseInt(couleur.slice(1, 3), 16);
        const g = parseInt(couleur.slice(3, 5), 16);
        const b = parseInt(couleur.slice(5, 7), 16);
        return (r + g + b) / 3;
    }

    onPageChange(lapage: any) {
        if (lapage === this.activepage) {
            if (this.nbnewcmd === 0) {
                this.offset = ((lapage - 1) * this.limite);
                this.gettable(this.bouticid, this.vue, this.place, this.table, this.limite, this.offset, this.selcol, this.selid);
                if (this.selid == 0)
                    localStorage.setItem('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin() + '_nav' + this.model.getnumtable(this.table), this.offset.toString());
            }
        }
    }
}
