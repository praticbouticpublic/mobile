import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { GetbackService } from '../getback.service';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { GlobalService } from '../global.service';
import { PresentationtableComponent } from '../components/presentationtable/presentationtable.component';
import {SelparamService} from "../selparam.service";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
    imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, PresentationtableComponent]
})
export class OrdersPage implements OnInit {

    myTitle = '';
    tablestr = 'commande';
    table: any;
    selcol = '';
    selid = 0;
    colorready = false;
    w: any;
    numtable: any;

    constructor(public menuCtrl: MenuController, public router: Router, public getback: GetbackService, public httpClient: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public selparam: SelparamService) {

    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(true);
        this.numtable = this.model.getnumtable(this.tablestr);
        this.myTitle = this.model.getTableParNom(this.tablestr).desc;
        this.selparam.initialize();
        this.selparam.setTable(this.tablestr);
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(true);
        this.selparam.initialize();
        this.selparam.setTable(this.tablestr);
    }

    ionViewDidLeave() {

    }

    goToDetailsOrderPage(id: any) {

    }

    reconnect() {
        this.storage.set('status', 'error');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    gotoUpperPage() {
        if (this.selid === 0) {
            this.router.navigate(['admin/login'], { replaceUrl: true });
        }
        else {
            if (this.table === 'relgrpoptart') {
                this.router.navigate(['admin/products/article'], { replaceUrl: true });
            }
            else if (this.table === 'option') {
                this.router.navigate(['admin/products/groupeopt'], { replaceUrl: true });
            }
        }
    }

}
