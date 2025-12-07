import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PresentationrecordComponent } from './presentationrecord.component';
import {IonicModule} from "@ionic/angular";

describe('PresentationrecordComponent', () => {
    let component: PresentationrecordComponent;
    let fixture: ComponentFixture<PresentationrecordComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PresentationrecordComponent]
}).compileComponents();

        fixture = TestBed.createComponent(PresentationrecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
