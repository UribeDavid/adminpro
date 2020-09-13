import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  intervalSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {


    /* this.retornaObservable()
    .pipe(
      retry()
    )
    .subscribe(
      valor => console.log('Subs: ', valor),
      (err) => console.warn('Error: ', err),
      () => console.info('obs terminado!')
    ); */
    this.intervalSubscription = this.retornaIntervalo()
      .subscribe(
        (valor) => console.log(valor)
      )
  }

  retornaIntervalo(): Observable<number> {

    const intervalo$ = interval(500).pipe(
      map(valor =>  valor+1),
      filter(value => value % 2 == 0),
      // take(10),
      )

    return intervalo$;
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    const obs$ = new Observable<number>( observer => {

      const interval = setInterval( () => {
        i++;
        observer.next(i);

        if ( i === 4) {
          clearInterval(interval); observer.complete();
        }
      }, 1000)
    });

    return obs$;
  }

  ngOnDestroy() {
    if (this.intervalSubscription) this.intervalSubscription.unsubscribe();
  }
}
