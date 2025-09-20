import { Component, OnInit } from '@angular/core';
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {Router} from "@angular/router";
import {ModeleService} from "../../modele.service";
import {IonicModule} from "@ionic/angular";
import {SelparamService} from "../../selparam.service";
import {PageBase} from "../../pagebase";

@Component({
    selector: 'app-cpzone',
    templateUrl: './cpzone.component.html',
    styleUrls: ['./cpzone.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule
    ]
})
export class CpzoneComponent extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    table = 'cpzone';

    constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
        super(router, selparam);
    }

    ngOnInit() {
        this.numtable = this.model.getnumtable("cpzone");
        this.myTitle = this.model.getTableParNom("cpzone").desc;
        this.selparam.setTable('cpzone');
        this.selparam.setSelcol("cpzoneid");
    }

}
