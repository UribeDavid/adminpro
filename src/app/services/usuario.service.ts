import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface'
import { LoginForm } from '../interfaces/login-form.interface'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone ) {
    this.googleInit();
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

    const token = localStorage.getItem('token') || '';

    return this.http.get( `${base_url}/login/renew`, {
      headers: {
        'token': token
      }
    }).pipe(
      tap( (response: any) => {
        localStorage.setItem('token', response.token);
      }),
      map( (response: any) => true ),
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
