import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    NavbarComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    ConfirmModalComponent,
    DateFormatPipe,
    TruncatePipe,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    NavbarComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    ConfirmModalComponent,
    DateFormatPipe,
    TruncatePipe,
    HighlightDirective,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class SharedModule { }
