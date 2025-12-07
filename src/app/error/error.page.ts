import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
    selector: 'app-error',
    templateUrl: './error.page.html',
    styleUrls: ['./error.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class ErrorPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
