import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sp-anulacion',
  templateUrl: './sp-anulacion.component.html',
  styleUrls: ['./sp-anulacion.component.css']
})
export class SpAnulacionComponent {

  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() estadoSol!: string;

  constructor(private sharedService: SharedService) {}

  /*enviarCotizacion(){
    this.sharedService.aprobarsp();
  }

  anularCotizacion(){
    this.sharedService.anularsp();
  }

  noAutorizarCotizacion(){
    this.sharedService.noautorizarsp();
  }*/

}
