import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShopdetailsPage } from './shopdetails.page';
import {IonicModule} from "@ionic/angular";

describe('ShopdetailsPage', () => {
    let component: ShopdetailsPage;
    let fixture: ComponentFixture<ShopdetailsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ShopdetailsPage]
}).compileComponents();

        fixture = TestBed.createComponent(ShopdetailsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
