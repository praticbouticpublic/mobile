import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaymentdetailsPage } from './paymentdetails.page';
import {IonicModule} from "@ionic/angular";

describe('PaymentdetailsPage', () => {
    let component: PaymentdetailsPage;
    let fixture: ComponentFixture<PaymentdetailsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PaymentdetailsPage]
}).compileComponents();

        fixture = TestBed.createComponent(PaymentdetailsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
