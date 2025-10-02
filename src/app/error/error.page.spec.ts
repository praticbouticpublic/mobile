import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorPage } from './error.page';
import {IonicModule} from "@ionic/angular";

describe('ErrorPage', () => {
    let component: ErrorPage;
    let fixture: ComponentFixture<ErrorPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ErrorPage]
}).compileComponents();

        fixture = TestBed.createComponent(ErrorPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
