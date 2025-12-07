import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdatePage } from './update.page';
import {IonicModule} from "@ionic/angular";

describe('UpdatePage', () => {
    let component: UpdatePage;
    let fixture: ComponentFixture<UpdatePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), UpdatePage]
}).compileComponents();

        fixture = TestBed.createComponent(UpdatePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
