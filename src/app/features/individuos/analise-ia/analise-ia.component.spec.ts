import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseIaComponent } from './analise-ia.component';

describe('AnaliseIaComponent', () => {
  let component: AnaliseIaComponent;
  let fixture: ComponentFixture<AnaliseIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliseIaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnaliseIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
