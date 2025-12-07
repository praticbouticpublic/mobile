import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderlinesPage } from './orderlines.page';
import {IonicModule} from "@ionic/angular";

describe('OrderlinesPage', () => {
    let component: OrderlinesPage;
    let fixture: ComponentFixture<OrderlinesPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), OrderlinesPage]
}).compileComponents();

        fixture = TestBed.createComponent(OrderlinesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
