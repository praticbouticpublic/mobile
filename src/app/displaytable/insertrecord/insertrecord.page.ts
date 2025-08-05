import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, Platform } from '@ionic/angular/standalone';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { addIcons } from "ionicons";
import { closeOutline, checkmarkOutline } from "ionicons/icons";

@Component({
    selector: 'app-insertrecord',
    templateUrl: './insertrecord.page.html',
    styleUrls: ['./insertrecord.page.scss'],
    standalone: false
})

export class InsertrecordPage implements OnInit {
    myTitle = '';
    table = '';
    selcol = '';
    selid = 0;
    numtable: any;

    constructor(public router: Router, public menuCtrl: MenuController, public model: ModeleService, public alertController: AlertController,
        public platform: Platform, public global: GlobalService, public msg: MessageService, public route: ActivatedRoute) {
        addIcons({ closeOutline, checkmarkOutline });

    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selid = +this.route.snapshot.params['selid'];
        this.selcol = this.route.snapshot.params['selcol'];
        this.table = this.route.snapshot.params['table'];
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = 'Insertion dans table ' + this.model.getTable(this.numtable).desc;
        this.msg.init();
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
                this.router.navigate(['admin/deliveries/displaytable/' + this.table + '/none/0'], { replaceUrl: true });
            }
            else if (this.table === 'statutcmd') {
                this.router.navigate(['admin/customerarea/displaytable/' + this.table + '/none/0'], { replaceUrl: true });
            }
            else if (this.table === 'promotion') {
                this.router.navigate(['admin/displaytable/' + this.table + '/none/0'], { replaceUrl: true });
            }
            else {
                this.router.navigate(['admin/products/displaytable/' + this.table + '/none/0'], { replaceUrl: true });
            }
        }
        else {
            this.router.navigate(['admin/update/displaytable/' + this.table + '/' + this.selcol + '/' + this.selid], { replaceUrl: true });
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

    onSubmitAction() {
        this.msg.publishMessage('submitInsert');
    }
}
