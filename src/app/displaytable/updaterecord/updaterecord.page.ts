import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, Platform } from '@ionic/angular/standalone';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { addIcons } from "ionicons";
import { closeOutline, checkmarkOutline } from "ionicons/icons";

@Component({
    selector: 'app-updaterecord',
    templateUrl: './updaterecord.page.html',
    styleUrls: ['./updaterecord.page.scss'],
    standalone: false
})

export class UpdaterecordPage implements OnInit {

    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;
    myTitle = '';

    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform, public alertController: AlertController,
        public model: ModeleService, public global: GlobalService, public msg: MessageService, public route: ActivatedRoute) {
        addIcons({ closeOutline, checkmarkOutline });
    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selid = +this.route.snapshot.params['selid'];
        this.selcol = this.route.snapshot.params['selcol'];
        this.id = +this.route.snapshot.params['id'];
        this.table = this.route.snapshot.params['table'];
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = 'Mise à jour dans table ' + this.model.getTable(this.numtable).desc;
        this.model.error.subscribe((publication) => {
            if (publication.form === this) {
                if (publication.msg !== null)
                    this.presentAlert(publication.msg);
                else
                    this.gotoUpperPage();
            }
        })
        this.msg.init();
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.msg.publishMessage('UpdateEnter');
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
        this.msg.publishMessage('submitUpdate');
    }
}
