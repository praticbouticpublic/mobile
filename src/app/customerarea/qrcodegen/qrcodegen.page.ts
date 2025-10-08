import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonRadioGroup, IonRadio, IonInput, IonButton } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { StorageService } from '../../storage.service';
import { environment } from 'src/environments/environment';
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-qrcodegen',
    templateUrl: './qrcodegen.page.html',
    styleUrls: ['./qrcodegen.page.scss'],
    imports: [IonicModule, ReactiveFormsModule]
})

export class QrcodegenPage implements OnInit {
    isSubmitted: any;
    qrcodegenForm: FormGroup;

    constructor(public formBuilder: FormBuilder, public router: Router, public platform: Platform,
        public storage: StorageService) {
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.qrcodegenForm = this.formBuilder.group({
            methv: ['3', [Validators.required]],
            nbtable: ['1',],
            nbex: ['1',],
        });
    }

    async onSubmit() {
        this.isSubmitted = true;
        if (!this.qrcodegenForm.valid) {
            return false;
        }
        else {
            this.storage.get('bouticid').then(async bouticid => {
                await Browser.open({
                    url: environment.apiroot + 'pdfqrcode?bouticid=' + bouticid + '&methv='
                        + this.qrcodegenForm.value.methv + '&nbtable=' + this.qrcodegenForm.value.nbtable +
                        '&nbex=' + this.qrcodegenForm.value.nbex
                });
            });
        }
    }

    gotoUpperPage() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }
}


