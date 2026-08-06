import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PerfilRoutingModule } from './perfil-routing.module';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';

@NgModule({
  declarations: [EditarPerfilComponent],
  imports: [CommonModule, SharedModule, PerfilRoutingModule]
})
export class PerfilModule { }
