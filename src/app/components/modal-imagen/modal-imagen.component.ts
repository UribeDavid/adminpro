import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  imagenASubir: File;
  imagenTemp: any = null;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imagenTemp = null
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {
    this.imagenASubir = file;

    if ( !file ) {
      return this.imagenTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imagenTemp = reader.result;
      console.log(reader.result);
    }
  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenASubir, tipo, id)
        .then( path => {
          this.modalImagenService.imagenChanged.emit(path);
          Swal.fire('Imagen actualizada', 'La imagen se actualizó correctamente', 'success');
          this.cerrarModal();
        })
        .catch( err => Swal.fire('Error', err.error.msg, 'error'));
  }

}
