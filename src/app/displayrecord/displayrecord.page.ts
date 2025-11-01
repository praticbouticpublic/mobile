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
import {PresentationrecordComponent} from "../components/presentationrecord/presentationrecord.component";

@Component({
    selector: 'app-displayrecord',
    templateUrl: './displayrecord.page.html',
    styleUrls: ['./displayrecord.page.scss'],
    imports: [
        IonicModule,
        PresentationrecordComponent
    ],
    standalone:true
})

export class DisplayrecordPage implements OnInit {

    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;
    myTitle = '';
    sstable ='';
    ssid =0;
    action  = '';
    loading = true;


    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform,
        public alertController: AlertController, public model: ModeleService, public global: GlobalService,
        public msg: MessageService, public route: ActivatedRoute, public selparam:SelparamService,
        public storage:StorageService, public getback: GetbackService, public httpClient: HttpClient,
        public header: HeaderService, public formAction: FormBuilder) {
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
                                this.loading =false;


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

    goBack() {
    }



}
