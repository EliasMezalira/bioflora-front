import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLevantamentoComponent } from './editar-levantamento.component';

describe('EditarLevantamentoComponent', () => {
  let component: EditarLevantamentoComponent;
  let fixture: ComponentFixture<EditarLevantamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLevantamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarLevantamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
