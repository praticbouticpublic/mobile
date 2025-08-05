import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { GlobalService } from '../global.service';
import { addIcons } from "ionicons";
import { add, returnDownBackOutline } from "ionicons/icons";

@Component({
    selector: 'app-displaytable',
    templateUrl: './displaytable.page.html',
    styleUrls: ['./displaytable.page.scss'],
    standalone: false
})

export class DisplaytablePage implements OnInit {

    myTitle = '';
    table = '';
    selid = 0;
    selcol = '';
    numtable: any;
    loaded = false;

    constructor(public router: Router, public menuCtrl: MenuController, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public route: ActivatedRoute) {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selid = +this.route.snapshot.params['selid'];
        this.selcol = this.route.snapshot.params['selcol'];
        this.table = this.route.snapshot.params['table'];
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = this.model.getTableParNom(this.table).desc;
        addIcons({ add, returnDownBackOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
    }

    ionViewWillEnter() {
        this.global.setFormComponent(this);
    }

    ionViewWillLeave() {

    }

    ionViewDidLeave() {

    }

    goToInsertPage(table: any, selcol: any, selid: any) {
        if (selcol === '') {
            selcol = 'none';
        }
        this.router.navigate(['admin/insertrecord/' + table + '/' + selcol + '/' + selid], { replaceUrl: true });
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
