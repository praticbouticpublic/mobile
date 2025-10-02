import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ModeleService} from "../../modele.service";
import {IonicModule} from "@ionic/angular";
import {PageBase} from "../../pagebase";
import {SelparamService} from "../../selparam.service";
import {PresentationtableComponent} from "../../components/presentationtable/presentationtable.component";
import {addIcons} from "ionicons";
import {add} from "ionicons/icons";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    imports: [
        IonicModule,
        PresentationtableComponent
    ]
})
export class ArticleComponent  extends PageBase implements OnInit {
    myTitle = '';
    numtable: any;
    selid = 0;
    selcol = '';
    table = "article";

  constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
      super(router, selparam);
      addIcons({ add });
  }

  ngOnInit()
  {
      this.numtable = this.model.getnumtable("article");
      this.myTitle = this.model.getTableParNom("article").desc;
      this.selparam.setTable('article');
      this.selparam.setSelcol('artid');
  }

}
