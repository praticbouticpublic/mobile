import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CustomerareaPage } from './customerarea.page';

describe('CustomerareaPage', () => {
    let component: CustomerareaPage;
    let fixture: ComponentFixture<CustomerareaPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CustomerareaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerareaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
