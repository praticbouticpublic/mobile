import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {ModeleService} from "../../modele.service";
import {PageBase} from "../../pagebase";
import {IonicModule} from "@ionic/angular";
import {SelparamService} from "../../selparam.service";
import {PresentationtableComponent} from "../../components/presentationtable/presentationtable.component";

@Component({
    selector: 'app-groupeopt',
    templateUrl: './groupeopt.component.html',
    styleUrls: ['./groupeopt.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule,
        PresentationtableComponent,
    ]
})
export class GroupeoptComponent  extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    table = "groupeopt";

    constructor(public router: Router, public model: ModeleService, public selparam:SelparamService) {
        super(router, selparam);
    }

    ngOnInit() {
        this.numtable = this.model.getnumtable("groupeopt");
        this.myTitle = this.model.getTableParNom("groupeopt").desc;
        this.selparam.setTable('groupeopt');
        this.selparam.setSelcol("grpoptid");
    }

}
