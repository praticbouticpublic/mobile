import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PresentationtableComponent } from './presentationtable.component';
import {IonicModule} from "@ionic/angular";

describe('PresentationtableComponent', () => {
    let component: PresentationtableComponent;
    let fixture: ComponentFixture<PresentationtableComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PresentationtableComponent],
    schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();

        fixture = TestBed.createComponent(PresentationtableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
