import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayrecordPage } from './displayrecord.page';

describe('DisplayrecordPage', () => {
  let component: DisplayrecordPage;
  let fixture: ComponentFixture<DisplayrecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayrecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
