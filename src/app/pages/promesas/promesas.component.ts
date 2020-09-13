import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios()
      .then(data => console.log(data));

    /* const promesa = new Promise((resolve, reject) => {
      if (false) {
        resolve('Hola Mundo');
      } else {
        reject('Algo salió mal');
      }
    });
    promesa.then((result) => {
      console.log('Hey terminé, este es el resultado: ' + result);
    })
    .catch(( err )=> {
      console.log('Error en mi promesa: ' + err);
    });
    console.log('Fin del Init'); */

  }

  getUsuarios() {

    const promesa = new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then( resp => resp.json())
        .then( result => resolve(result.data));
    });

    return promesa;
  }
}
