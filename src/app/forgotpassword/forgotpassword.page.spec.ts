import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgotpasswordPage } from './forgotpassword.page';
import {IonicModule} from "@ionic/angular";

describe('ForgotpasswordPage', () => {
    let component: ForgotpasswordPage;
    let fixture: ComponentFixture<ForgotpasswordPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ForgotpasswordPage]
}).compileComponents();

        fixture = TestBed.createComponent(ForgotpasswordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
