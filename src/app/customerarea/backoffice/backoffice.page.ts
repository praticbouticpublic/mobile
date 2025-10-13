import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { StorageService } from '../../storage.service';
import { GlobalService } from '../../global.service';
import { strings } from 'src/app/strings';

@Component({
    selector: 'app-backoffice',
    templateUrl: './backoffice.page.html',
    styleUrls: ['./backoffice.page.scss'],
    imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton]
})
export class BackofficePage implements OnInit {

    resp: any;

    constructor(public alertController: AlertController, public platform: Platform, public router: Router, public storage: StorageService,
        public global: GlobalService) {

    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
    }

    async razctrl() {
        await this.confirmAlert();

    }

    async confirmAlert() {
        const alert = this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Question,
            subHeader: strings.AskConfirmation,
            message: strings.DeletePagination,
            buttons: [{
                text: strings.Yes,
                role: 'oui',
                handler: () => {
                    const total = localStorage.length;
                    const list = new Array();
                    for (let i = 0; i < total; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('praticboutic_ctrl_' + this.global.getServer() + '_' + this.global.getLogin())) {
                            list.push(key);
                        }
                    }
                    while (list.length > 0) {
                        localStorage.removeItem(list.pop());
                    }
                }
            },
            {
                text: strings.No,
                role: 'non',
                handler: () => {

                }
            }]
        });

        await (await alert).present();

    }

    gotoUpperPage() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    chgemail() {
        this.router.navigate(['admin/raddressing']);
    }

}
