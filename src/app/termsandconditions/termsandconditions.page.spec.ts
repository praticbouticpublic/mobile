import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TermsandconditionsPage } from './termsandconditions.page';
import {IonicModule} from "@ionic/angular";

describe('TermsandconditionsPage', () => {
    let component: TermsandconditionsPage;
    let fixture: ComponentFixture<TermsandconditionsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), TermsandconditionsPage]
}).compileComponents();

        fixture = TestBed.createComponent(TermsandconditionsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
