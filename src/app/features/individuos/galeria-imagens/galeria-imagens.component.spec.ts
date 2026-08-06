import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaImagensComponent } from './galeria-imagens.component';

describe('GaleriaImagensComponent', () => {
  let component: GaleriaImagensComponent;
  let fixture: ComponentFixture<GaleriaImagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaImagensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaImagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
