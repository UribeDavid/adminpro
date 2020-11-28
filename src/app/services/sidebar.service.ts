import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  /* menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        {
          titulo: 'Main',
          path: '/'
        },
        {
          titulo: 'Progress Bar',
          path: 'progress',
        },
        {
          titulo: 'Gráficas',
          path: 'grafica1'
        },
        {
          titulo: 'Promesas',
          path: 'promesas'
        },
        {
          titulo: 'RXJS',
          path: 'rxjs'
        }
      ]
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        {
          titulo: 'Usuarios',
          path: 'usuarios'
        },
        {
          titulo: 'Hospitales',
          path: 'hospitales',
        },
        {
          titulo: 'Medicos',
          path: 'medicos'
        },
      ]
    },
  ] */
  menu: any[] = []

  constructor() { }

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu'));
  }
}
