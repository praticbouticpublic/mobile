import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QrcodegenPage } from './qrcodegen.page';
import {IonicModule} from "@ionic/angular";

describe('QrcodegenPage', () => {
    let component: QrcodegenPage;
    let fixture: ComponentFixture<QrcodegenPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), QrcodegenPage]
}).compileComponents();

        fixture = TestBed.createComponent(QrcodegenPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
