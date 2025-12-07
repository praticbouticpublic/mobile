import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.page.html',
    styleUrls: ['./logout.page.scss'],
    imports: [IonContent, IonSpinner]
})
export class LogoutPage implements OnInit {


    constructor(public storage: StorageService, public router: Router) { }

    ngOnInit() {
        this.storage.remove('bouticid');
        this.storage.remove('alias');
        this.storage.remove('login');
        this.storage.remove('stripecustomerid');
        this.storage.remove('mdp');
        this.storage.remove('emailcode');
        this.storage.set('logged', 'false');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

}
