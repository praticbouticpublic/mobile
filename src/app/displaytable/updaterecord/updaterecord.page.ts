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
import {StorageService} from "../../storage.service";
import {GetbackService} from "../../getback.service";
import {HttpClient} from "@angular/common/http";
import {HeaderService} from "../../header.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-updaterecord',
    templateUrl: './updaterecord.page.html',
    styleUrls: ['./updaterecord.page.scss'],
    imports: [ PresentationrecordComponent],
    standalone: true,
})

export class UpdaterecordPage implements OnInit {

    numtable: any;
    myTitle = '';
    table = '';
    idtoup = 0;
    selcol = '';
    selid = 0;
    loading = true;


    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform, public alertController: AlertController,
        public model: ModeleService, public global: GlobalService, public msg: MessageService, public route: ActivatedRoute,
        public selparam:SelparamService, public storage:StorageService, public getback:GetbackService, public httpClient: HttpClient,
        public header:HeaderService, public formAction:FormBuilder) {

        addIcons({ closeOutline, checkmarkOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selparam.getTable().then( table =>{
            this.table = table;
            this.selparam.getIdtoup().then( idtoup =>{
                this.idtoup = idtoup;
                this.selparam.getSelcol().then( selcol =>{
                    this.selcol = selcol;
                    this.selparam.getSelid().then( selid =>{
                        this.selid = selid;
                        this.numtable = this.model.getnumtable(this.table);
                        this.myTitle = 'Mise à jour dans table ' + this.model.getTable(this.numtable).desc;
                        this.loading = false;
                    })
                })
            })
        })

    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.msg.publishMessage('UpdateEnter');
    }

    ionViewWillLeave() {
        this.msg.completeMessage();
    }

    gotoUpperPage() {
        this.selparam.setTable(this.table);
        this.selparam.setIdtoup(0);
        //this.selparam.setSelcol(this.selcol);
        //this.selparam.setSelid(this.selid);
        if (this.selid === 0) {
            if ((this.table === 'barlivr') || (this.table === 'cpzone')) {
                this.router.navigate(['admin/deliveries/' + this.table ], { replaceUrl: true });
            }
            else if (this.table === 'statutcmd') {
                this.router.navigate(['admin/customerarea/' + this.table ], { replaceUrl: true });
            }
            else if (this.table === 'promotion') {
                this.router.navigate(['admin/' + this.table ], { replaceUrl: true });
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
