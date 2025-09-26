import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShopPage } from './shop.page';
import {IonicModule} from "@ionic/angular";

describe('ShopPage', () => {
    let component: ShopPage;
    let fixture: ComponentFixture<ShopPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ShopPage]
}).compileComponents();

        fixture = TestBed.createComponent(ShopPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
