import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import * as myGlobals from '../../app/global';
import { addIcons } from "ionicons";
import { sendOutline, arrowUndoOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-raddressing',
    templateUrl: './raddressing.page.html',
    styleUrls: ['./raddressing.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class RaddressingPage implements OnInit {

    isSubmitted = false;
    radressingFormGroup: FormGroup;
    autoradressing = false;
    login: any;

    constructor(public menuCtrl: MenuController, public router: Router, public formBuilder: FormBuilder, public httpClient: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService, public header:HeaderService,
                public routerOutlet:IonRouterOutlet) {
        addIcons({ sendOutline, arrowUndoOutline });

    }

    get email(): string {
        return this.radressingFormGroup.value.email;
    }

    get errorControl() {
        return this.radressingFormGroup.controls;
    }

    ngOnInit() {
        this.radressingFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.maxLength(255)]]
        });
        this.storage.set('lasturl', this.router.url);

    }

    async onSubmit() {
        this.isSubmitted = true;
        if ((this.radressingFormGroup.status === 'VALID') || (this.autoradressing === true)) {
            const dblemailpostData = {
                email: this.autoradressing ? this.login : this.email
            };

            this.httpClient.post(environment.apiroot + 'verify-email', dblemailpostData, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.header.setToken(data.token);
                    if (data !== 'KO') {
                        this.storage.set('login', dblemailpostData.email);
                        this.storage.set('emailcode', '');
                        this.router.navigate(['admin/changification/' + dblemailpostData.email]);
                    }
                    else {
                        this.dblemailAlert('Le courriel que vous avez entré est déjà utilisé');
                    }
                },
                error: (err: any) => {
                    this.dblemailAlert(err.error.error);
                    this.remadelaststep();
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['admin/customerarea/backoffice'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.set('lasturl', this.router.url);
        // Réactive le swipe-back uniquement sur cette page
        this.routerOutlet.swipeGesture = true;

    }

    ionViewDidLeave(): void {
        this.menuCtrl.enable(true);
        this.routerOutlet.swipeGesture = false;
    }

    async dblemailAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème Lors de la vérifcation du courriel',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }


}
