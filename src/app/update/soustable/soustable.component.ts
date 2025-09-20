import { Component, OnInit } from '@angular/core';
import {DisplaytablePage} from "../../displaytable/displaytable.page";
import {Router} from "@angular/router";
import {ModeleService} from "../../modele.service";
import {SelparamService} from "../../selparam.service";
import {IonicModule} from "@ionic/angular";
import {PageBase} from "../../pagebase";

@Component({
    selector: 'app-soustable',
    templateUrl: './soustable.component.html',
    styleUrls: ['./soustable.component.scss'],
    imports: [
        DisplaytablePage,
        IonicModule
    ],
    standalone: true,
})

export class SoustableComponent  extends PageBase implements OnInit {

    myTitle = '';
    numtable: any;
    soustable = '';
    ssid = 0;
    ssselcol = '';
    table ='';
    selid = 0;
    sstable ='n';
    loading = true;
    hassstable = '';
    id= 0;

    constructor(public router: Router, public model: ModeleService, public selparam: SelparamService) {
        super(router, selparam);
    }

    ngOnInit() {
        this.selparam.getSousTable().then(soustable => {
            this.soustable = soustable;
                this.selparam.getSelcol().then(selcol => {
                    this.selcol = selcol;
                    this.selparam.getSelid().then(selid => {
                        this.selid = selid;
                        this.numtable = this.model.getnumtable(soustable);
                        this.myTitle = this.model.getTableParNom(soustable).desc;
                        this.hassstable = this.model.getTableParNom(soustable).sstable;
                        this.loading = false;
                    })
                })
            })
    }

}
