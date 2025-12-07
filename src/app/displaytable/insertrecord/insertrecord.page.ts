import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { addIcons } from "ionicons";
import { closeOutline, checkmarkOutline } from "ionicons/icons";
import { PresentationrecordComponent } from '../../components/presentationrecord/presentationrecord.component';
import {SelparamService} from "../../selparam.service";
import {SubmitBase} from "../../submitbase";
import {HttpClient} from "@angular/common/http";
import {HeaderService} from "../../header.service";
import {GetbackService} from "../../getback.service";
import {StorageService} from "../../storage.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-insertrecord',
    templateUrl: './insertrecord.page.html',
    styleUrls: ['./insertrecord.page.scss'],
    imports: [PresentationrecordComponent]
})

export class InsertrecordPage implements OnInit {
    myTitle = '';
    table = '';
    selcol = '';
    selid = 0;
    numtable: any;
    loading = true;

    constructor(public router: Router, public menuCtrl: MenuController, public model: ModeleService,
                public alertController: AlertController, public platform: Platform, public global: GlobalService,
                public msg: MessageService, public route: ActivatedRoute, public selparam:SelparamService,
                public storage:StorageService, public getback: GetbackService, public httpClient: HttpClient,
                public header:HeaderService, public formAction:FormBuilder) {

        addIcons({ closeOutline, checkmarkOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.msg.init();
        this.selparam.getTable().then(table =>{
            this.table = table;
            this.selparam.getSelid().then(selid =>{
                this.selid = selid;
                this.selparam.getSelcol().then(selcol =>{
                    this.selcol = selcol;
                    this.numtable = this.model.getnumtable(this.table);

                    this.loading = false;

                });
            });
        });
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.msg.publishMessage('InsertEnter');
    }

    ionViewWillLeave() {
        this.msg.completeMessage();
    }

    gotoUpperPage() {
        if (this.selid === 0) {
            if ((this.table === 'barlivr') || (this.table === 'cpzone')) {
                this.router.navigate(['admin/deliveries/' + this.table ], { replaceUrl: true });
            }
            else if (this.table === 'statutcmd') {
                this.router.navigate(['admin/customerarea/' + this.table ], { replaceUrl: true });
            }
            else if (this.table === 'promotion') {
                this.router.navigate(['admin/displaytable/' + this.table ], { replaceUrl: true });
            }
            else {
                this.router.navigate(['admin/products/' + this.table ], { replaceUrl: true });
            }
        }
        else {
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

    goBack() {
    }
}
