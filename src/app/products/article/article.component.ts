import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {ModeleService} from "../../modele.service";
import {IonicModule} from "@ionic/angular";
import {PageBase} from "../../pagebase";
import {SelparamService} from "../../selparam.service";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule
    ]
})
export class ArticleComponent  extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    selid = 0;
    selcol = "artid";
    table = "article";

  constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
      super(router, selparam);
  }

  ngOnInit() {
      this.numtable = this.model.getnumtable("article");
      this.myTitle = this.model.getTableParNom("article").desc;
      this.selparam.setTable('article');
      this.selparam.setSelcol('artid');
  }

}
