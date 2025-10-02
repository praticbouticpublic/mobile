import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { StorageService } from '../storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {HeaderService} from "../header.service";
import { Capacitor } from "@capacitor/core";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-mymoney',
    templateUrl: './mymoney.page.html',
    styleUrls: ['./mymoney.page.scss'],
    imports: [IonicModule]
})

export class MymoneyPage implements OnInit {

    loaded = false;

    constructor(public httpClient: HttpClient, public storage: StorageService, public alertController: AlertController,
        public navCtrl: NavController, public router: Router, public header:HeaderService) { }

    ngOnInit()
    {
        this.storage.get('bouticid').then(async bouticid => {
            const platform = Capacitor.getPlatform();
            const postData = {
                bouticid,
                platform
            };
            this.httpClient.post(environment.apiroot + 'login-link', postData, await this.header.buildHttpOptions()).subscribe({
                 next: (data: any) => {
                      this.header.setToken(data.token);
                           Browser.open({ url: String(data.url) });
                           this.loaded = true;
                           /*this.storage.get('lasturl').then(res => {
                               if (res !== '')
                                   this.router.navigate([res], { replaceUrl: true });
                               else
                                   this.router.navigate(['admin/products'], { replaceUrl: true });
                           });*/
                 },
                 error: (err: any) => {
                      this.presentAlert(err.error.error);
                      this.loaded = true;
                      this.router.navigate(['admin/products'], { replaceUrl: true });
                 }
            });
        });
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème Lors de l\'acquistion du compte connecté',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }
}
