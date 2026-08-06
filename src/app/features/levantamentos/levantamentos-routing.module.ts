import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarLevantamentosComponent } from './listar-levantamentos/listar-levantamentos.component';
import { CriarLevantamentoComponent } from './criar-levantamento/criar-levantamento.component';
import { EditarLevantamentoComponent } from './editar-levantamento/editar-levantamento.component';
import { DetalheLevantamentoComponent } from './detalhe-levantamento/detalhe-levantamento.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ListarLevantamentosComponent, canActivate: [AuthGuard] },
  { path: 'criar', component: CriarLevantamentoComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: EditarLevantamentoComponent, canActivate: [AuthGuard] },
  { path: ':id', component: DetalheLevantamentoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevantamentosRoutingModule { }
