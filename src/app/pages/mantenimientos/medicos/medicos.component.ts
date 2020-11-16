import { Component, OnDestroy, OnInit } from '@angular/core';

import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Subscription } from 'rxjs';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  medicosTemp: Medico[] = []
  cargando: boolean = true;
  medicosSubscription: Subscription;
  imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.imagenChanged
      .pipe( delay(50) )
      .subscribe( () => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicosSubscription = this.medicoService.cargarMedicos().subscribe(
      (response: any) => {
        if (response.ok) {
          this.medicos = response.medicos;
          this.medicosTemp = [...response.medicos];
          this.cargando = false;
        } else {
          this.medicos = [...this.medicosTemp];
          this.cargando = false;
        }
      }
    );
  }

  buscar(termino: string) {
    this.busquedaService.buscar('medicos', termino).subscribe(
      (response: any) => {
        if (response.ok) {
          this.medicos = response.medicos;
          this.medicosTemp = response.medicos;
        } else {
          this.medicos = [...this.medicosTemp];
        }
      }
    );
  }

  eliminarMedico(medico: Medico) {

    Swal.fire({
      title: 'Está seguro?',
      text: 'Borrar un medico es una acción irreversible!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then( (result) => {
      if ( result.value ) {
        this.medicoService.eliminarMedico( medico._id ).subscribe(
          (response: any) => {
            if (response.ok) {
              this.medicos = this.medicos.filter(i => i._id !== medico._id);
              Swal.fire('Eliminado!', 'Medico eliminado correctamente', 'success');
            } else {
              Swal.fire('Error', response.msg, 'error');
            }
          }
        );
      }
    });

  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  abrirSwalAlert() {

  }

  ngOnDestroy(): void {
    if ( this.medicosSubscription ) this.medicosSubscription.unsubscribe();
    if ( this.imgSubs ) this.imgSubs.unsubscribe();
  }

}
