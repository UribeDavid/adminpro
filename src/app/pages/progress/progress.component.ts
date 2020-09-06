import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  progreso1 = 20;
  progreso2 = 40;

  get porcentaje1() {
    return `${ this.progreso1 }%`;
  }

  get porcentaje2() {
    return `${ this.progreso2 }%`;
  }

  cambioValorHijo(event) {
    this.progreso1 = event;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
