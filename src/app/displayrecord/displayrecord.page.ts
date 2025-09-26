import { Component, OnInit } from '@angular/core';
import {DisplaytablePage} from "../displaytable/displaytable.page";
import {IonicModule} from "@ionic/angular";
import {UpdaterecordPage} from "../displaytable/updaterecord/updaterecord.page";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController, Platform} from "@ionic/angular/standalone";
import {ModeleService} from "../modele.service";
import {GlobalService} from "../global.service";
import {MessageService} from "../message.service";
import {SelparamService} from "../selparam.service";
import {addIcons} from "ionicons";
import {checkmarkOutline, closeOutline} from "ionicons/icons";
import {InsertrecordPage} from "../displaytable/insertrecord/insertrecord.page";
import {ViewrecordPage} from "../displaytable/viewrecord/viewrecord.page";
import {SubmitBase} from "../submitbase";
import {StorageService} from "../storage.service";
import {GetbackService} from "../getback.service";
import {HttpClient} from "@angular/common/http";
import {HeaderService} from "../header.service";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-displayrecord',
    templateUrl: './displayrecord.page.html',
    styleUrls: ['./displayrecord.page.scss'],
    imports: [
        IonicModule,
        UpdaterecordPage,
        InsertrecordPage,
        ViewrecordPage
    ],
    standalone:true
})
export class DisplayrecordPage extends SubmitBase  implements OnInit {

    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;
    myTitle = '';
    sstable ='';
    ssid =0;
    action  = '';

    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform,
        public alertController: AlertController, public model: ModeleService, public global: GlobalService,
        public msg: MessageService, public route: ActivatedRoute, public selparam:SelparamService,
        public storage:StorageService, public getback: GetbackService, public httpClient: HttpClient,
        public header: HeaderService, public formAction: FormBuilder) {
        super(model, storage, getback, router, selparam, alertController, httpClient, header, global, formAction);
        addIcons({ closeOutline, checkmarkOutline });
    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selparam.getTable().then(table => {
            this.table = table;
            this.selparam.getIdtoup().then(id => {
                this.id = id;
                this.selparam.getSelcol().then(selcol => {
                    this.selcol = selcol;
                    this.selparam.getSelid().then(selid => {
                        this.selid = selid;
                        this.selparam.getAction().then(action => {
                            this.table = table;
                            this.selid = selid;
                            this.selcol = selcol;
                            this.id = id;
                            this.action = action;
                            this.input_table = this.table;
                            this.input_selcol = this.selcol;
                            this.input_selid = this.selid;
                            this.input_id = this.id;
                            this.input_action = this.action;
                            super.initialize().then(() => {
                                this.numtable = this.model.getnumtable(this.table);
                                switch (this.action) {
                                    case 'insert':
                                        this.myTitle = 'Insertion dans table ' + this.model.getTable(this.numtable).desc;
                                        break;
                                    case 'update':
                                        this.myTitle = 'Mise à jour dans table ' + this.model.getTable(this.numtable).desc;
                                        break;
                                    case 'view':
                                    default:
                                        this.myTitle = 'Détails ' + this.model.getTable(this.numtable).desc;
                                        break;
                                }

                                this.loading = false;
                            });
                        })
                    })
                })
            })
        })
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        switch (this.selparam.action){
            case 'update' : this.msg.publishMessage('UpdateEnter'); break;
            case 'insert' : this.msg.publishMessage('InsertEnter'); break;
            case 'view' : this.msg.publishMessage('ViewEnter'); break;
            default : break;
        }
    }

    ionViewWillLeave() {
        this.msg.completeMessage();
    }

    gotoUpperPage() {
        if (this.selid === 0) {
            this.selparam.setTable(this.table);
            this.selparam.setIdtoup(0);
            this.selparam.setSelid(0);
            this.selparam.setSelcol('');
            switch (this.table) {
                case 'categorie':
                case 'article':
                case 'groupeopt':
                    this.router.navigate(['admin/products/' + this.table ], { replaceUrl: true });
                    break;
                case 'barlivr':
                case 'cpzone':
                    this.router.navigate(['admin/deliveries/' + this.table], { replaceUrl: true });
                    break;
                case 'statutcmd':
                    this.router.navigate(['admin/customerarea/statutcmd'], { replaceUrl: true });
                    break;
                case 'promotion':
                    this.router.navigate(['admin/promotion'], { replaceUrl: true });
                    break;
                default:
                    this.router.navigate(['admin/' + this.table ], { replaceUrl: true });
                    break;

            }
        }
        else {
            this.selparam.setIdtoup(this.selid);
            switch (this.table)
            {
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

    doSubmitAction(event: Event)  {
        this.selparam.getAction().then(async action => {
            await super.onSubmitAction(event, action );
        })

    }
}
