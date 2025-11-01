import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { GlobalService } from '../global.service';
import { addIcons } from "ionicons";
import { add, returnDownBackOutline } from "ionicons/icons";
import { PresentationtableComponent } from '../components/presentationtable/presentationtable.component';
import {SelparamService} from "../selparam.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-displaytable',
    templateUrl: './displaytable.page.html',
    styleUrls: ['./displaytable.page.scss'],
    imports: [IonicModule, PresentationtableComponent],
    standalone: true,
})

export class DisplaytablePage implements OnInit {

    myTitle = '';
    numtable: any;
    loaded = false;

    constructor(public router: Router, public menuCtrl: MenuController, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public route: ActivatedRoute,
        public selparam:SelparamService) {

        addIcons({ add, returnDownBackOutline });
    }

    @Input() table: string;
    @Input() selcol: string;
    @Input() selid: number;



    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = this.model.getTableParNom(this.table).desc;
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

    goToInsertPage(table: any, selcol: any, selid: any)
    {
        this.selparam.setTable(table);
        this.selparam.setAction('insert');
        this.router.navigate(['admin/displayrecord'], { replaceUrl: true });
    }

    gotoUpperPage()
    {
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
