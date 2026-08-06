import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarLevantamentoComponent } from './criar-levantamento.component';

describe('CriarLevantamentoComponent', () => {
  let component: CriarLevantamentoComponent;
  let fixture: ComponentFixture<CriarLevantamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarLevantamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarLevantamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
