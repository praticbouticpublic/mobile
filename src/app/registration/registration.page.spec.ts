import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegistrationPage } from './registration.page';
import {IonicModule} from "@ionic/angular";

describe('RegistrationPage', () => {
    let component: RegistrationPage;
    let fixture: ComponentFixture<RegistrationPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrationPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(RegistrationPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
