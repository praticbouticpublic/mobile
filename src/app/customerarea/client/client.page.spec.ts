import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClientPage } from './client.page';
import {IonicModule} from "@ionic/angular";

describe('ClientPage', () => {
    let component: ClientPage;
    let fixture: ComponentFixture<ClientPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ClientPage]
}).compileComponents();

        fixture = TestBed.createComponent(ClientPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
