import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaiementPage } from './paiement.page';
import {IonicModule} from "@ionic/angular";

describe('PaiementPage', () => {
    let component: PaiementPage;
    let fixture: ComponentFixture<PaiementPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PaiementPage]
}).compileComponents();

        fixture = TestBed.createComponent(PaiementPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
