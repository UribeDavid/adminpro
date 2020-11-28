import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  formUsuario = this.formBuilder.group({
    nombre: [null, [ Validators.required ]],
    email: [null, [ Validators.required, Validators.email ]]
  });
  usuario = this.usuarioService.usuario;
  imagenASubir: File;
  imagenTemp: any = null;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.formUsuario.get('nombre').setValue(this.usuarioService.usuario.nombre);
    this.formUsuario.get('email').setValue(this.usuarioService.usuario.email);
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil( this.formUsuario.value ).subscribe(
      (response: any) => {
        if (response.ok) {
          const { nombre, email } = response.usuarioActualizado;
          this.usuario.nombre = nombre;
          this.usuario.email = email;
          Swal.fire('Perfil actualizado', 'Se actualizó correctamente', 'success');
        } else {
          Swal.fire('Error', response.msg, 'error');
        }
      },
      err => Swal.fire('Error', err.error.msg, 'error')
    )
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
    }
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto( this.imagenASubir, 'usuarios', this.usuario.uid)
        .then( path => {
          this.usuario.img = path;
          Swal.fire('Imagen actualizada', 'La imagen se actualizó correctamente', 'success');
        })
        .catch( err => Swal.fire('Error', err.error.msg, 'error'));
  }
}
