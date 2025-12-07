import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IdentificationPage } from './identification.page';
import {IonicModule} from "@ionic/angular";

describe('IdentificationPage', () => {
    let component: IdentificationPage;
    let fixture: ComponentFixture<IdentificationPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), IdentificationPage]
}).compileComponents();

        fixture = TestBed.createComponent(IdentificationPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
