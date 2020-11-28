import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _visible: boolean = false;
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string;

  public imagenChanged: EventEmitter<string> = new EventEmitter<string>();

  get visible() {
    return this._visible;
  }

  abrirModal( tipo: 'usuarios' | 'medicos' | 'hospitales', id: string, img: string = 'no-image') {
    this.tipo = tipo;
    this.id = id;

    if ( img.includes('https') ) {
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`;
    }
    this._visible = true;
  }

  cerrarModal() {
    this._visible = false;
  }

  constructor() { }
}
