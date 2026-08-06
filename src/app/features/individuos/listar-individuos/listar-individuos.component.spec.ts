import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarIndividuosComponent } from './listar-individuos.component';

describe('ListarIndividuosComponent', () => {
  let component: ListarIndividuosComponent;
  let fixture: ComponentFixture<ListarIndividuosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarIndividuosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarIndividuosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
