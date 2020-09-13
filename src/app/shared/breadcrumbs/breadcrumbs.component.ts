import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { pipe, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  titulo: string;

  tituloSubscription$: Subscription;

  constructor(private router: Router) {
    this.tituloSubscription$ = this.getArgumentosRuta().subscribe(
      ({ titulo }) => {
        this.titulo = titulo;
        // document.title = titulo; //Para colocar el nombre de la pagina arriba en la pestaña
      }
    );
  }

  ngOnInit(): void {
  }

  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd),
        filter( (event: ActivationEnd) => !event.snapshot.firstChild),
        map( (event: ActivationEnd) => event.snapshot.data)
      );
  }

  ngOnDestroy() {
    if (this.tituloSubscription$) this.tituloSubscription$.unsubscribe();
  }

}
