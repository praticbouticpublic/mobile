import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DisplaytablePage } from './displaytable.page';
import {IonicModule} from "@ionic/angular";

describe('DisplaytablePage', () => {
    let component: DisplaytablePage;
    let fixture: ComponentFixture<DisplaytablePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DisplaytablePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(DisplaytablePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
