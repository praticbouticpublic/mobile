import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform } from '@ionic/angular/standalone';
import { GetbackService } from '../getback.service';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { GlobalService } from '../global.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
    standalone: false
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
        public model: ModeleService, public global: GlobalService) {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.numtable = this.model.getnumtable(this.tablestr);
        this.myTitle = this.model.getTableParNom(this.tablestr).desc;
    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(true);
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
                this.router.navigate(['admin/products/displaytable/article/none/0'], { replaceUrl: true });
            }
            else if (this.table === 'option') {
                this.router.navigate(['admin/products/displaytable/groupeopt/none/0'], { replaceUrl: true });
            }
        }
    }

}
