import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarIndividuoComponent } from './criar-individuo.component';

describe('CriarIndividuoComponent', () => {
  let component: CriarIndividuoComponent;
  let fixture: ComponentFixture<CriarIndividuoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarIndividuoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
