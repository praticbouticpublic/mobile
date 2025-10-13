import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeliveriesPage } from './deliveries.page';

describe('DeliveriesPage', () => {
  let component: DeliveriesPage;
  let fixture: ComponentFixture<DeliveriesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [CUSTOM_ELEMENTS_SCHEMA, DeliveriesPage]
}).compileComponents();

    fixture = TestBed.createComponent(DeliveriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
