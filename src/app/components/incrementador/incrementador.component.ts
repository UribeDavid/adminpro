import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @Input('valor') progreso: number = 25;
  @Input() btnClass: string = 'btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`
  }

  cambiarValor(valor: number) {
    if (this.progreso >= 100 && valor > 0) {
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }
    if (this.progreso <= 0 && valor < 0){
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }
    this.progreso = this.progreso + valor
    this.valorSalida.emit(this.progreso);
  }

  onChange(valorEmitido: number) {
    if (valorEmitido > 100) {
      this.progreso = 100;
    } else if (valorEmitido < 0) {
      this.progreso = 0;
    } else {
      this.progreso = valorEmitido;
      this.valorSalida.emit(this.progreso);
    }
  }

}
