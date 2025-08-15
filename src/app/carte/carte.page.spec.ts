import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CartePage } from './carte.page';
import {IonicModule} from "@ionic/angular";

describe('CartePage', () => {
    let component: CartePage;
    let fixture: ComponentFixture<CartePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CartePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CartePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
