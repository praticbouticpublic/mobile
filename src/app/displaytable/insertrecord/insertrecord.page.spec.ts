import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InsertrecordPage } from './insertrecord.page';
import {IonicModule} from "@ionic/angular";

describe('InsertpagePage', () => {
    let component: InsertrecordPage;
    let fixture: ComponentFixture<InsertrecordPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), InsertrecordPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
}).compileComponents();

        fixture = TestBed.createComponent(InsertrecordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
