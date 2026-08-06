import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImagemService } from '../../../core/services/imagem.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-imagem',
  templateUrl: './upload-imagem.component.html',
  styleUrls: ['./upload-imagem.component.scss']
})
export class UploadImagemComponent {
  @Input() individuoId = 0;
  @Output() uploaded = new EventEmitter<void>();
  file?: File;
  uploading = false;

  constructor(private imagemService: ImagemService, private toastr: ToastrService) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  upload(): void {
    if (!this.file || !this.individuoId) {
      return;
    }
    this.uploading = true;
    this.imagemService.upload(this.individuoId, this.file).subscribe({
      next: () => {
        this.toastr.success('Imagem enviada');
        this.uploading = false;
        this.uploaded.emit();
      },
      error: () => {
        this.toastr.error('Falha no upload');
        this.uploading = false;
      }
    });
  }
}
