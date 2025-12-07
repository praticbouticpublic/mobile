import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    MenuController,
    Platform,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    AlertController
} from '@ionic/angular/standalone';
import { ModeleService } from 'src/app/modele.service';
import { GlobalService } from '../../global.service';
import { MessageService } from 'src/app/message.service';
import { addIcons } from "ionicons";
import { returnDownBackOutline } from "ionicons/icons";
import { PresentationrecordComponent } from '../../components/presentationrecord/presentationrecord.component';
import { SelparamService } from "../../selparam.service";
import { SubmitBase } from "../../submitbase";
import { StorageService } from "../../storage.service";
import { GetbackService } from "../../getback.service";
import { HttpClient } from "@angular/common/http";
import { HeaderService } from "../../header.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-viewrecord',
    templateUrl: './viewrecord.page.html',
    styleUrls: ['./viewrecord.page.scss'],
    imports: [ PresentationrecordComponent]
})

export class ViewrecordPage  implements OnInit {

    myTitle = '';
    selid = 0;
    selcol = '';
    id = 0;
    table = '';
    numtable: any;
    loading = true;
    @Input() form_!: FormGroup;

    constructor(public router: Router, public menuCtrl: MenuController, public model: ModeleService,
                public alertController: AlertController, public platform: Platform, public global: GlobalService,
                public msg: MessageService, public route: ActivatedRoute, public selparam:SelparamService,
                public storage:StorageService, public getback: GetbackService, public httpClient: HttpClient,
                public header:HeaderService, public formAction: FormBuilder) {

        addIcons({ returnDownBackOutline });
    }


    ngOnInit() {
        this.global.setFormComponent(this);
        this.menuCtrl.enable(true);
        this.selparam.getTable().then( table =>{
            this.table = table;
            this.selparam.getIdtoup().then( idtoup =>{
                this.selparam.getSelcol().then( selcol =>{
                    this.selcol = selcol;
                    this.selparam.getSelid().then( selid =>{
                        this.selid = selid;
                        this.selparam.getCmdid().then( cmdid =>{
                            this.selparam.getLigneCmdid().then( lignecmdid => {
                                switch (this.table)
                                {
                                    case 'commande':
                                        this.id = cmdid;
                                    break;
                                    case 'lignecmd':
                                        this.id = lignecmdid;
                                    break;
                                    default:
                                        this.id = idtoup;
                                    break;
                                }
                                this.numtable = this.model.getnumtable(this.table);
                                this.loading = false;

                            });
                        });

                    })
                })
            })
        })
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.msg.publishMessage('ViewEnter');
    }

    ionViewWillLeave() {

    }

    gotoUpperPage() {
        if (this.table === 'commande') {
            this.router.navigate(['admin/orders'], { replaceUrl: true });
        }
        else if (this.table === 'lignecmd') {
            this.router.navigate(['admin/viewrecord/commande/' + this.selid ], { replaceUrl: true });
        }
        else {
            this.router.navigate(['admin/displaytable/' + this.table ], { replaceUrl: true });
        }
    }

    goBack()
    {

    }


}
