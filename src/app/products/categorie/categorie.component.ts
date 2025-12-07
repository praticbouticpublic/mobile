import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {ModeleService} from "../../modele.service";
import {SelparamService} from "../../selparam.service";
import {PageBase} from "../../pagebase";
import {IonicModule} from "@ionic/angular";
import {PresentationtableComponent} from "../../components/presentationtable/presentationtable.component";

@Component({
    selector: 'app-categorie',
    templateUrl: './categorie.component.html',
    styleUrls: ['./categorie.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule,
        PresentationtableComponent
    ]
})
export class CategorieComponent  extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    selid = 0;
    table = "categorie";

    constructor(public router: Router, public model: ModeleService, public selparam:SelparamService) {
        super(router, selparam);
    }

  ngOnInit() {
      this.numtable = this.model.getnumtable("categorie");
      this.myTitle = this.model.getTableParNom("categorie").desc;
      this.selparam.setTable('categorie');
      this.selparam.setSelcol("catid");
  }

}
