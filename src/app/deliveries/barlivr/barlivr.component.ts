import { Component, OnInit } from '@angular/core';
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {Router} from "@angular/router";
import {ModeleService} from "../../modele.service";
import {IonicModule} from "@ionic/angular";
import {SelparamService} from "../../selparam.service";
import {PageBase} from "../../pagebase";
import {PresentationtableComponent} from "../../components/presentationtable/presentationtable.component";

@Component({
    selector: 'app-barlivr',
    templateUrl: './barlivr.component.html',
    styleUrls: ['./barlivr.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule,
        PresentationtableComponent
    ]
})
export class BarlivrComponent extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    table = 'barlivr';

    constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
        super(router, selparam);
    }

    ngOnInit() {
        this.numtable = this.model.getnumtable("barlivr");
        this.myTitle = this.model.getTableParNom("barlivr").desc;
        this.selparam.setTable('barlivr');
        this.selparam.setSelcol("barlivrid");
    }

}
