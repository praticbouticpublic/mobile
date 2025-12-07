import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubscriptionPage } from './subscription.page';
import {IonicModule} from "@ionic/angular";

describe('SubscriptionPage', () => {
    let component: SubscriptionPage;
    let fixture: ComponentFixture<SubscriptionPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), SubscriptionPage]
}).compileComponents();

        fixture = TestBed.createComponent(SubscriptionPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
