import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MymoneyPage } from './mymoney.page';
import {IonicModule} from "@ionic/angular";

describe('MymoneyPage', () => {
    let component: MymoneyPage;
    let fixture: ComponentFixture<MymoneyPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), MymoneyPage]
}).compileComponents();

        fixture = TestBed.createComponent(MymoneyPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
