import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular/standalone';
import { StorageService } from '../../storage.service';


@Component({
    selector: 'app-orderstatus',
    templateUrl: './orderstatus.page.html',
    styleUrls: ['./orderstatus.page.scss'],
    standalone: false
})
export class OrderstatusPage implements OnInit {

    constructor(public router: Router, public platform: Platform, public storage: StorageService) {

    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.router.navigate(['admin/displaytable/statutcmd/none/0'], { replaceUrl: true });
    }

}
