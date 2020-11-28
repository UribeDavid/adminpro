import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  usuarios: Usuario[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.buscarGlobal(params.termino);
      }
    );
  }

  buscarGlobal( termino: string ) {
    this.busquedaService.buscarGlobal(termino).subscribe(
      (response: any) => {
        if (response.ok) {
          this.hospitales = response.hospitales;
          this.medicos = response.medicos;
          this.usuarios = response.usuarios;
        } else {
          this.hospitales = [];
          this.medicos = [];
          this.usuarios = [];
        }
      }
    );
  }

}
