import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegistrationdetailsPage } from './registrationdetails.page';
import {IonicModule} from "@ionic/angular";

describe('RegistrationdetailsPage', () => {
    let component: RegistrationdetailsPage;
    let fixture: ComponentFixture<RegistrationdetailsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), RegistrationdetailsPage]
}).compileComponents();

        fixture = TestBed.createComponent(RegistrationdetailsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
