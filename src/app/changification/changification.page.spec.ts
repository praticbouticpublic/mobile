import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangificationPage } from './changification.page';
import {IonicModule} from "@ionic/angular";

describe('ChangificationPage', () => {
    let component: ChangificationPage;
    let fixture: ComponentFixture<ChangificationPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ChangificationPage]
}).compileComponents();

        fixture = TestBed.createComponent(ChangificationPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
