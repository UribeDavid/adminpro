import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'token': this.token
      }
    }
  }

  cargarMedicos() {
    return this.http.get(`${ base_url }/medicos`, this.headers);
  }

  medicoById( id ) {
    return this.http.get(`${ base_url }/medicos/${ id }`, this.headers);
  }

  crearMedico( medico: Medico ) {
    return this.http.post(`${ base_url }/medicos`, medico, this.headers);
  }

  actualizarMedico( id: string, nombre: string, hospitalId: string) {
    return this.http.put(`${ base_url }/medicos/${ id }`, this.headers);
  }

  eliminarMedico( id: string ) {
    return this.http.delete(`${ base_url }/medicos/${ id }`, this.headers);
  }
}
