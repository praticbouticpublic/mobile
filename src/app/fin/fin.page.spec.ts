import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FinPage } from './fin.page';
import {IonicModule} from "@ionic/angular";

describe('FinPage', () => {
    let component: FinPage;
    let fixture: ComponentFixture<FinPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), FinPage]
}).compileComponents();

        fixture = TestBed.createComponent(FinPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
