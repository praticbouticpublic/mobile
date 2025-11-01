import { Component, OnInit } from '@angular/core';
import {DisplaytablePage} from "../displaytable/displaytable.page";
import {Router} from "@angular/router";
import {ModeleService} from "../modele.service";
import {IonicModule} from "@ionic/angular";
import {PageBase} from "../pagebase";
import {SelparamService} from "../selparam.service";
import {PresentationtableComponent} from "../components/presentationtable/presentationtable.component";

@Component({
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule,
        PresentationtableComponent
    ]
})
export class PromotionComponent  extends PageBase implements OnInit  {

    myTitle = '';
    numtable: any;
    table = 'promotion';

    constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
        super(router, selparam);
    }

    ngOnInit() {
        this.numtable = this.model.getnumtable("promotion");
        this.myTitle = this.model.getTableParNom("promotion").desc;
        this.selparam.setTable("promotion");
        this.selparam.setSelcol("promoid");
    }
}
