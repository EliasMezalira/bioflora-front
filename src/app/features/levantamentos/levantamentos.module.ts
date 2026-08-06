import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LevantamentosRoutingModule } from './levantamentos-routing.module';
import { ListarLevantamentosComponent } from './listar-levantamentos/listar-levantamentos.component';
import { CriarLevantamentoComponent } from './criar-levantamento/criar-levantamento.component';
import { EditarLevantamentoComponent } from './editar-levantamento/editar-levantamento.component';
import { DetalheLevantamentoComponent } from './detalhe-levantamento/detalhe-levantamento.component';

@NgModule({
  declarations: [
    ListarLevantamentosComponent,
    CriarLevantamentoComponent,
    EditarLevantamentoComponent,
    DetalheLevantamentoComponent
  ],
  imports: [CommonModule, SharedModule, LevantamentosRoutingModule]
})
export class LevantamentosModule { }
