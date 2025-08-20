import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderstatusPage } from './orderstatus.page';
import {IonicModule} from "@ionic/angular";

describe('OrderstatusPage', () => {
    let component: OrderstatusPage;
    let fixture: ComponentFixture<OrderstatusPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OrderstatusPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(OrderstatusPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
