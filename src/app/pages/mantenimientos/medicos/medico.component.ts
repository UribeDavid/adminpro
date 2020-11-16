import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {

  medicoForm: FormGroup;
  hospitales: Hospital[] = [];
  hospitalSeleccionado: Hospital;
  hospitalesSubscription: Subscription;
  medicoSeleccionado: Medico;

  constructor(private formBuilder: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute
              ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( params => {
      this.medicoById(params.id);
    });

    this.cargarHospitales();
    this.medicoForm = this.formBuilder.group({
      nombre: ['Prueba', [Validators.required]],
      hospital: ['PruebaHospital', [Validators.required]],
    });

    this.medicoForm.get('hospital').valueChanges.subscribe(
      hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(i => i._id == hospitalId);
      }
    );
  }

  cargarHospitales() {
    this.hospitalesSubscription = this.hospitalService.cargarHospitales().subscribe(
      (response: any) => {
        if (response.ok) {
          this.hospitales = response.hospitales;
        } else {
          this.hospitales = [];
        }
      }
    );
  }

  medicoById( id ) {

    if ( id == 'nuevo' ) return;

    this.medicoService.medicoById( id ).pipe(delay(50)).subscribe(
      (response: any) => {

        if ( !response.medico ) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        if (response.ok) {
          this.medicoSeleccionado = response.medico;
          const { nombre, hospital: { _id } } = response.medico;
          this.medicoForm.setValue( { nombre, hospital: _id } );
        } else {
          this.medicoSeleccionado = null;
        }
      }
    );
  }

  guardarMedico() {

    if ( this.medicoSeleccionado ) {

      this.medicoService.actualizarMedico(
        this.medicoSeleccionado._id,
        this.medicoForm.get('nombre').value,
        this.medicoForm.get('hospital').value
      ).subscribe( (response: any) => {
        if (response.ok) {
          Swal.fire('Actualizado!', 'Medico actualizado correctamente', 'success');

        } else {
          Swal.fire('Error!', 'Ocurrió un error al actualizar el medico', 'error');
        }
      });

    } else {

      this.medicoService.crearMedico(this.medicoForm.value).subscribe(
        (response: any) => {
          if (response.ok) {
            Swal.fire('Creado!', 'Medico creado correctamente', 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ response.medico._id }`);
          } else {
            Swal.fire('Error', response.msg, 'error');
          }
        }
      );

    }

  }

  ngOnDestroy(): void {
    if (this.hospitalesSubscription) this.hospitalesSubscription.unsubscribe();
  }

}
