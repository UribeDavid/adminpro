import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  totalUsuarios: number = 0;
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  pagDesde: number = 0;
  cargando: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.modalImagenService.imagenChanged
        .pipe(
          delay(50)
        )
        .subscribe( img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.pagDesde).subscribe(
      (response: any) => {
        if (response.ok) {
          this.totalUsuarios = response.totalRegistros;
          this.usuarios = response.usuarios;
          this.usuariosTemp = response.usuarios;
          this.cargando = false;
        } else {
          this.totalUsuarios = 0;
          this.usuarios = [];
          this.cargando = false;
        }
      }
    );
  }

  cambiarPagina( valor: number ) {
    this.pagDesde += valor;

    if (this.pagDesde < 0) {
      this.pagDesde = 0;
    } else if ( this.pagDesde > this.totalUsuarios ) {
      this.pagDesde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if (termino.length == 0) {
      return this.usuarios = [...this.usuariosTemp];
    }

    this.cargando = true;
    this.busquedasService.buscar('usuarios', termino).subscribe(
      (response: any) => {
        console.log(response.resultados);
        if (response.ok) {
          this.usuarios = response.resultados;
          this.cargando = false;
        } else {
          this.usuarios = [];
          this.cargando = false;
        }
      },
      error => this.cargando = false
    )
  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.usuario.uid ) {
      return Swal.fire('Error', 'No puede borrarse a sí mismo', 'error');
    }

    Swal.fire({
      title: 'Está seguro?',
      text: "Esta acción es irreversible!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario.uid ).subscribe(
          (response: any) => {
            if (response.ok) {
              this.usuarios = this.usuarios.filter( user => user.uid != usuario.uid);
              Swal.fire(
                'Eliminado!',
                'El usuario ha sido eliminado.',
                'success'
              );
            } else {
              Swal.fire('Error!', response.msg, 'error');
            }
          },
          err => Swal.fire('Error!', err.error.msg, 'error')
        )
      }
    })
  }

  cambiarRole( usuario: Usuario ) {
    this.cargando = true;
    this.usuarioService.actualizarUsuario(usuario).subscribe(
      ( response: any ) => {
      if (response.ok) {
        this.cargando = false;
      } else {
        this.cargando = false;
        Swal.fire('Error!', response.msg, 'error');
      }
    },
    err => {
      this.cargando = false;
      Swal.fire('Error!', err.error.msg, 'error');
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
