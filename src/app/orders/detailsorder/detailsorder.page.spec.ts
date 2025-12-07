import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DetailsorderPage } from './detailsorder.page';
import {IonicModule} from "@ionic/angular";

describe('DetailsorderPage', () => {
    let component: DetailsorderPage;
    let fixture: ComponentFixture<DetailsorderPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), DetailsorderPage]
}).compileComponents();

        fixture = TestBed.createComponent(DetailsorderPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
