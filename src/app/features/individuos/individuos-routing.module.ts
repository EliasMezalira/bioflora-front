import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarIndividuosComponent } from './listar-individuos/listar-individuos.component';
import { CriarIndividuoComponent } from './criar-individuo/criar-individuo.component';
import { EditarIndividuoComponent } from './editar-individuo/editar-individuo.component';
import { DetalheIndividuoComponent } from './detalhe-individuo/detalhe-individuo.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ListarIndividuosComponent, canActivate: [AuthGuard] },
  { path: 'criar/:levantamentoId', component: CriarIndividuoComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: EditarIndividuoComponent, canActivate: [AuthGuard] },
  { path: ':id', component: DetalheIndividuoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividuosRoutingModule { }
