import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales: Hospital[] = [];
  hospitalesTemp: Hospital[] = [];
  cargando: boolean = true;
  hospitalesSubscription: Subscription;
  imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.imagenChanged
      .pipe( delay(50) )
      .subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalesSubscription = this.hospitalService.cargarHospitales().subscribe(
      (response: any) => {
        if (response.ok) {
          this.hospitales = response.hospitales;
          this.hospitalesTemp = response.hospitales;
          this.cargando = false;
        } else {
          this.hospitales = [];
          this.cargando = false;
        }
      }
    );
  }

  buscar( termino: string ) {

    if ( termino.length == 0 ) return this.hospitales = [...this.hospitalesTemp];

    this.cargando = true;

    this.busquedasService.buscar('hospitales', termino).subscribe(
      (response: any) => {
        console.log(response);
        if (response.ok) {
          this.hospitales = response.resultados;
          this.cargando = false;
        } else {
          this.hospitales = [...this.hospitalesTemp];
          this.cargando = false;
        }
      }
    );
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe(
      (response: any) => {
        if (response.ok) {
          Swal.fire('Hospital actualizado!', 'Hospital actualizado correctamente', 'success');
        } else {
          Swal.fire('Error', response.msg, 'error');
        }
      }
    );
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospital(hospital._id).subscribe(
      (response: any) => {
        if (response.ok) {
          this.hospitales = this.hospitales.filter( i => i._id !== hospital._id );
          Swal.fire('Eliminado!', 'Hospital eliminado correctamente', 'success');
        } else {
          Swal.fire('Error', response.msg, 'error');
        }
      }
    );
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

  async abrirSwalAlert() {
    const { value = '' } = await Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value).subscribe(
        (response: any) => {
          if ( response.ok ) {
            this.hospitales.push( response.hospital );
            Swal.fire('Hospital creado!', 'Hospital creado correctamente', 'success');
          } else {
            Swal.fire('Error', response.msg, 'error');
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if( this.hospitalesSubscription ) this.hospitalesSubscription.unsubscribe();
    if( this.imgSubs ) this.imgSubs.unsubscribe();
  }

}
