import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShopsettingsPage } from './shopsettings.page';
import {IonicModule} from "@ionic/angular";

describe('ShopsettingsPage', () => {
    let component: ShopsettingsPage;
    let fixture: ComponentFixture<ShopsettingsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ShopsettingsPage]
}).compileComponents();

        fixture = TestBed.createComponent(ShopsettingsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
