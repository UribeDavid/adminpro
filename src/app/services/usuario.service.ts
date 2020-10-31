import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface'
import { LoginForm } from '../interfaces/login-form.interface'
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  googleInit() {

    return new Promise ( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '549124534601-4ika45emp4e6f8aoj04v4ve33sn0h7m2.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });

  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get( `${base_url}/login/renew`, {
      headers: {
        'token': this.token
      }
    }).pipe(
      map( (response: any) => {
        const { email, google, nombre, role, img = '', uid } = response.usuario;

        this.usuario = new Usuario( nombre, email, '', img, google, role, uid);

        localStorage.setItem('token', response.token);

        return true;
      }),
      catchError( err => of(false))
    )
  }

  crearUsuario( formData: RegisterForm ) {

    return this.http.post( `${base_url}/usuarios`, formData )
      .pipe(
        tap( (response: any) => {
          localStorage.setItem('token', `${response.token}`);
        })
      )
  }

  actualizarPerfil( data: { email: string, nombre: string }) {

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, { ...data, role: this.usuario.role}, {
      headers: {
        'token': this.token
      }
    });
  }

  login( formData: LoginForm) {

    return this.http.post( `${base_url}/login`, formData )
      .pipe(
        tap( (response: any) => {
          localStorage.setItem('token', `${response.token}`);
        })
      )
  }

  loginGoogle( token ) {

    return this.http.post( `${base_url}/login/google`, { token } )
      .pipe(
        tap( (response: any) => {
          localStorage.setItem('token', `${response.token}`);
        })
      )
  }
}
