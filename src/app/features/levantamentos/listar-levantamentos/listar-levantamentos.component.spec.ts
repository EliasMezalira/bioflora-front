import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLevantamentosComponent } from './listar-levantamentos.component';

describe('ListarLevantamentosComponent', () => {
  let component: ListarLevantamentosComponent;
  let fixture: ComponentFixture<ListarLevantamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLevantamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarLevantamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
