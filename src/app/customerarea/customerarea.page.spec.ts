import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CustomerareaPage } from './customerarea.page';

describe('CustomerareaPage', () => {
    let component: CustomerareaPage;
    let fixture: ComponentFixture<CustomerareaPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), CustomerareaPage]
}).compileComponents();

        fixture = TestBed.createComponent(CustomerareaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
