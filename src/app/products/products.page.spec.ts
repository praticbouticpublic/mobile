import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductsPage } from './products.page';
import {IonicModule} from "@ionic/angular";

describe('ProductsPage', () => {
    let component: ProductsPage;
    let fixture: ComponentFixture<ProductsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ProductsPage]
}).compileComponents();

        fixture = TestBed.createComponent(ProductsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
