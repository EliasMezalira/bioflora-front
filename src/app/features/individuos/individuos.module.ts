import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { IndividuosRoutingModule } from './individuos-routing.module';
import { ListarIndividuosComponent } from './listar-individuos/listar-individuos.component';
import { CriarIndividuoComponent } from './criar-individuo/criar-individuo.component';
import { EditarIndividuoComponent } from './editar-individuo/editar-individuo.component';
import { DetalheIndividuoComponent } from './detalhe-individuo/detalhe-individuo.component';
import { GaleriaImagensComponent } from './galeria-imagens/galeria-imagens.component';
import { UploadImagemComponent } from './upload-imagem/upload-imagem.component';
import { AnaliseIaComponent } from './analise-ia/analise-ia.component';

@NgModule({
  declarations: [
    ListarIndividuosComponent,
    CriarIndividuoComponent,
    EditarIndividuoComponent,
    DetalheIndividuoComponent,
    GaleriaImagensComponent,
    UploadImagemComponent,
    AnaliseIaComponent
  ],
  imports: [CommonModule, SharedModule, IndividuosRoutingModule]
})
export class IndividuosModule { }
