import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular/standalone';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { addIcons } from "ionicons";
import { returnDownBackOutline } from "ionicons/icons";

@Component({
    selector: 'app-viewrecord',
    templateUrl: './viewrecord.page.html',
    styleUrls: ['./viewrecord.page.scss'],
    standalone: false
})

export class ViewrecordPage implements OnInit {

    myTitle = '';
    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;

    constructor(public router: Router, public menuCtrl: MenuController, public platform: Platform,
        public model: ModeleService, public global: GlobalService, public msg: MessageService, public route: ActivatedRoute) {
        addIcons({ returnDownBackOutline });
    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selid = +this.route.snapshot.params['selid'];
        this.selcol = this.route.snapshot.params['selcol'];
        this.id = +this.route.snapshot.params['id'];
        this.table = this.route.snapshot.params['table'];
        this.numtable = this.model.getnumtable(this.table);
        this.myTitle = 'Détails ' + this.model.getTable(this.numtable).desc;
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.msg.publishMessage('ViewEnter');
    }

    ionViewWillLeave() {

    }

    async onSubmitAction(event: Event) {

    }

    gotoUpperPage() {
        if (this.table === 'commande') {
            this.router.navigate(['admin/orders'], { replaceUrl: true });
        }
        else if (this.table === 'lignecmd') {
            this.router.navigate(['admin/viewrecord/commande/' + this.selid + '/none/0'], { replaceUrl: true });
        }
        else {
            this.router.navigate(['admin/displaytable/' + this.table + '/' + this.selid + '/none/0'], { replaceUrl: true });
        }
    }

}
