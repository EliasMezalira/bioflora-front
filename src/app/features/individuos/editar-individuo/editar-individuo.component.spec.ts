import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarIndividuoComponent } from './editar-individuo.component';

describe('EditarIndividuoComponent', () => {
  let component: EditarIndividuoComponent;
  let fixture: ComponentFixture<EditarIndividuoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarIndividuoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarIndividuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
