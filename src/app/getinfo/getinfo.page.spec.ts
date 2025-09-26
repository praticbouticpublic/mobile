import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GetinfoPage } from './getinfo.page';
import {IonicModule} from "@ionic/angular";

describe('GetinfoPage', () => {
    let component: GetinfoPage;
    let fixture: ComponentFixture<GetinfoPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), GetinfoPage]
}).compileComponents();

        fixture = TestBed.createComponent(GetinfoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
