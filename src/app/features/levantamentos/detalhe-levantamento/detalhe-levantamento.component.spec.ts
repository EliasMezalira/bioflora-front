import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheLevantamentoComponent } from './detalhe-levantamento.component';

describe('DetalheLevantamentoComponent', () => {
  let component: DetalheLevantamentoComponent;
  let fixture: ComponentFixture<DetalheLevantamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheLevantamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalheLevantamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
