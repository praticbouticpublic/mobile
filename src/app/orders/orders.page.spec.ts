import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import {IonicModule} from "@ionic/angular";

describe('OrdersPage', () => {
    let component: OrdersPage;
    let fixture: ComponentFixture<OrdersPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OrdersPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(OrdersPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
