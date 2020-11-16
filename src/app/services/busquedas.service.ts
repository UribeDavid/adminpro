import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  buscar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {

    if ( tipo == 'hospitales' || tipo == 'medicos' ) {
      return this.http.get(`${ base_url }/todo/coleccion/${ tipo }/${ termino }`, this.headers);
    } else {
      return this.http.get(`${ base_url }/todo/coleccion/${ tipo }/${ termino }`, this.headers)
              .pipe(
                map( (response: any) => {
                  const resultados = response.resultados.map(
                    user => new Usuario(
                      user.nombre,
                      user.email,
                      '',
                      user.img,
                      user.google,
                      user.role,
                      user.uid
                    )
                  )

                  return {
                    ok: response.ok,
                    resultados
                  }
                })
              );
    }
  }
}
