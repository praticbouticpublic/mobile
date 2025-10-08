import {Router} from "@angular/router";
import {SelparamService} from "./selparam.service";
import {addIcons} from "ionicons";
import {add} from "ionicons/icons";

export class PageBase {

    selid =0;
    table = '';
    selcol = '';

    constructor(public router:Router, public selparam:SelparamService)
    {
        addIcons({ add });
    }

    goToInsertPage(table: any, selcol: any, selid: any) {
        this.selparam.setTable(table);
        this.selparam.setIdtoup(0);
        this.selparam.setSelcol(selcol);
        this.selparam.setSelid(selid);
        this.selparam.setAction('insert');
        if ((selcol === '') && (selid === 0))
            this.router.navigate(['admin/displayrecord'], { replaceUrl: true });
        else
            this.router.navigate(['admin/displaysousrecord'], { replaceUrl: true });
    }

    gotoUpperPage() {
        /*this.selparam.setIdtoup(0);
        this.selparam.setSelcol("");
        this.selparam.setSelid(0);*/
        if (this.selid === 0) {
            this.selparam.setTable("");
            this.router.navigate(['admin/login'], { replaceUrl: true });
        }
        else {

            if (this.table === 'relgrpoptart') {
                this.selparam.setTable("article");
                this.router.navigate(['admin/products/article'], { replaceUrl: true });
            }
            else if (this.table === 'option') {
                this.selparam.setTable("option");
                this.router.navigate(['admin/products/groupeopt'], { replaceUrl: true });
            }
            else if (this.table === 'promotion') {
                this.selparam.setTable("promotion");
                this.router.navigate(['admin/promotion'], { replaceUrl: true });
            }
        }
    }
}
