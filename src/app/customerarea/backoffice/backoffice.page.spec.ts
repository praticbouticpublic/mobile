import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BackofficePage } from './backoffice.page';
import {IonicModule} from "@ionic/angular";

describe('BackofficePage', () => {
    let component: BackofficePage;
    let fixture: ComponentFixture<BackofficePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), BackofficePage]
}).compileComponents();

        fixture = TestBed.createComponent(BackofficePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
