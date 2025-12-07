import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdaterecordPage } from './updaterecord.page';
import {IonicModule} from "@ionic/angular";

describe('UpdatepagePage', () => {
    let component: UpdaterecordPage;
    let fixture: ComponentFixture<UpdaterecordPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), UpdaterecordPage]
}).compileComponents();

        fixture = TestBed.createComponent(UpdaterecordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
