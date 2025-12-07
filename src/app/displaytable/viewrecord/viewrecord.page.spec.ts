import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewrecordPage } from './viewrecord.page';
import {IonicModule} from "@ionic/angular";

describe('ViewrecordPage', () => {
    let component: ViewrecordPage;
    let fixture: ComponentFixture<ViewrecordPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ViewrecordPage]
}).compileComponents();

        fixture = TestBed.createComponent(ViewrecordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
