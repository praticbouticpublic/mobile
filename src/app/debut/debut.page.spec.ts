import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebutPage } from './debut.page';
import {IonicModule} from "@ionic/angular";

describe('DebutPage', () => {
    let component: DebutPage;
    let fixture: ComponentFixture<DebutPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), DebutPage]
}).compileComponents();

        fixture = TestBed.createComponent(DebutPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
