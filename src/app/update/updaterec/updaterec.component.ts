import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ModeleService} from "../../modele.service";
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {
    AlertController,
    MenuController, Platform
} from "@ionic/angular/standalone";
import {UpdaterecordPage} from "../../displaytable/updaterecord/updaterecord.page";
import {GlobalService} from "../../global.service";
import {MessageService} from "../../message.service";
import {addIcons} from "ionicons";
import {checkmarkOutline, closeOutline} from "ionicons/icons";
import {SelparamService} from "../../selparam.service";
import {IonicModule} from "@ionic/angular";
import {SubmitBase} from "../../submitbase";
import {StorageService} from "../../storage.service";
import {GetbackService} from "../../getback.service";
import {HttpClient} from "@angular/common/http";
import {HeaderService} from "../../header.service";
import {FormBuilder} from "@angular/forms";
import {PresentationrecordComponent} from "../../components/presentationrecord/presentationrecord.component";

@Component({
    selector: 'app-updaterec',
    templateUrl: './updaterec.component.html',
    styleUrls: ['./updaterec.component.scss'],
    imports: [
        IonicModule,
        PresentationrecordComponent
    ]
})

export class UpdaterecComponent implements OnInit {

    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;
    myTitle = '';
    sstablenom ='';
    sstable ='';
    ssid =0;
    ssselcol ='';
    loading = true;

    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform,
                public alertController: AlertController, public model: ModeleService, public global: GlobalService,
                public msg: MessageService, public route: ActivatedRoute, public selparam:SelparamService,
                public storage: StorageService, public getback: GetbackService, public httpClient: HttpClient,
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
                this.numtable = this.model.getnumtable(this.table);
                this.myTitle = 'Mise à jour dans table ' + this.model.getTable(this.numtable).desc;
                this.sstable = this.model.getTableParNom(this.table).sstable;
                let numlnk: any;
                for (let i = 0; i < this.model.getLiens().length; i++) {
                    if (this.model.getLiens()[i].nom === this.table) {
                        numlnk = i;
                    }
                }
                for (let tbl of this.model.getTables()) {
                    if (this.model.getLiens()[numlnk].srctbl === tbl.nom) {

                        this.sstablenom = tbl.nom;
                        this.ssid = this.id;
                        this.ssselcol = this.model.getLiens()[numlnk].srcfld;
                    }
                }
                this.model.error.subscribe((publication) => {
                    if (publication.form === this) {
                        if (publication.msg !== null)
                            this.presentAlert(publication.msg);
                        else
                            this.gotoUpperPage();
                    }
                })

                this.msg.init();
                this.loading = false;
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

        switch (this.table) {
            case 'categgorie':
            case 'article':
            case 'groupeopt':
                this.selparam.setSelid(0);
                this.selparam.setSelcol('');
                this.router.navigate(['admin/products/' + this.table ], { replaceUrl: true });
                break;
            case 'barlivr':
            case 'cpzone':
                this.selparam.setSelid(0);
                this.selparam.setSelcol('');
                this.router.navigate(['admin/deliveries/' + this.table], { replaceUrl: true });
                break;
            case 'statutcmd':
                this.selparam.setSelid(0);
                this.selparam.setSelcol('');
                this.router.navigate(['admin/customerarea/statutcmd'], { replaceUrl: true });
                break;
            case 'promotion':
                this.selparam.setSelid(0);
                this.selparam.setSelcol('');
                this.router.navigate(['admin/promotion'], { replaceUrl: true });
                break;
            case 'relgrpoptart':
            case 'option':
                this.selparam.setTable(this.sstablenom);
                this.selparam.setSelid(this.ssid);
                this.selparam.setSelcol(this.ssselcol);
                this.router.navigate(['admin/update/soustable'], { replaceUrl: true });
                break;
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

    /*doSubmitAction(event: Event)  {
        super.onSubmitAction(event, 'update');
    }*/

    goBack() {
    }

}
