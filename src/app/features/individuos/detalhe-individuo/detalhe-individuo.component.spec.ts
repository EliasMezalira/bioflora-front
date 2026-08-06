import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheIndividuoComponent } from './detalhe-individuo.component';

describe('DetalheIndividuoComponent', () => {
  let component: DetalheIndividuoComponent;
  let fixture: ComponentFixture<DetalheIndividuoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheIndividuoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalheIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
