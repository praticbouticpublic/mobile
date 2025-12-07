import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RaddressingPage } from './raddressing.page';
import {IonicModule} from "@ionic/angular";

describe('RaddressingPage', () => {
    let component: RaddressingPage;
    let fixture: ComponentFixture<RaddressingPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), RaddressingPage]
}).compileComponents();

        fixture = TestBed.createComponent(RaddressingPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
