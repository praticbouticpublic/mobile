import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, AlertController, Platform, IonHeader, IonToolbar, IonImg, IonTitle, IonContent, IonSpinner, IonItem, IonLabel, IonInput, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import * as myGlobals from '../../app/global';
import { addIcons } from "ionicons";
import { sendOutline, arrowUndoOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";


@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.page.html',
    styleUrls: ['./forgotpassword.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class ForgotpasswordPage implements OnInit {

    passwordFormGroup: FormGroup;
    isSubmitted = false;
    loaded = false;

    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController, public platform: Platform,
        public http: HttpClient, public alertController: AlertController, public storage: StorageService, public header:HeaderService) {
        addIcons({ sendOutline, arrowUndoOutline });
    }

    get email(): string {
        return this.passwordFormGroup.value.email;
    }

    get errorControl() {
        return this.passwordFormGroup.controls;
    }


    ngOnInit() {
        this.passwordFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.maxLength(255)]]
        });
        this.storage.set('lasturl', this.router.url);
        this.loaded = true;
    }

    async onSubmit() {
        this.loaded = false;
        this.isSubmitted = true;
        if (!this.passwordFormGroup.valid) {
            return false;
        }
        else {

            const sendpwdpostData = {
                email: this.email,
            };

            this.http.post<any>(environment.apiroot + 'reset-password', sendpwdpostData, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    if (data === 'OK') {
                        this.sendedAlert();
                    }
                    this.router.navigate(['admin/login'], { replaceUrl: true });
                },
                error: (err: any) => {
                    this.presentAlert(err.error.error);
                    this.router.navigate(['admin/login'], { replaceUrl: true });
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.set('lasturl', this.router.url);
    }

    ionViewDidLeave(): void {
        this.menuCtrl.enable(true);
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème lors du renvoi du mot de passe',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }


    async sendedAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Message',
            subHeader: 'Envoi du mot de passe',
            message: 'Un email vous a été envoyé avec le nouveau mot de passe.',
            buttons: ['OK']
        });

        await alert.present();
    }
}
