import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed when confirm is called', () => {
    const confirmedSpy = jest.spyOn(component.confirmed, 'emit');

    component.confirm();

    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit cancelled when close is called', () => {
    const cancelledSpy = jest.spyOn(component.cancelled, 'emit');

    component.close();

    expect(cancelledSpy).toHaveBeenCalledTimes(1);
  });
});
