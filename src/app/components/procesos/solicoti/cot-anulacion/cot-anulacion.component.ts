import { Component, Input, ViewChild,Injector } from '@angular/core';
import { SolicotiComponent } from '../solicoti.component';

@Component({
  selector: 'app-cot-anulacion',
  templateUrl: './cot-anulacion.component.html',
  styleUrls: ['./cot-anulacion.component.css']
})
export class CotAnulacionComponent {

  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() estadoSol!: string;

  @ViewChild(SolicotiComponent) solCotChild!: SolicotiComponent;

  constructor(private injector: Injector) {
    this.solCotChild = this.injector.get(SolicotiComponent);
   }

  ngOnInit(): void {
    //console.log(this.tipoSol, this.noSol, this.estadoSol);
    console.log(this.solCotChild);
  }

  enviarCotizacion(){
    this.solCotChild.metodo2();
  }

  metodo(){
    console.log('metodo');
  }

  anularCotizacion(){

  }

  noAutorizarCotizacion(){

  }

}
