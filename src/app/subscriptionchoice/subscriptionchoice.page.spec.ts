import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubscriptionchoicePage } from './subscriptionchoice.page';
import {IonicModule} from "@ionic/angular";

describe('SubscriptionchoicePage', () => {
    let component: SubscriptionchoicePage;
    let fixture: ComponentFixture<SubscriptionchoicePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), SubscriptionchoicePage]
}).compileComponents();

        fixture = TestBed.createComponent(SubscriptionchoicePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
