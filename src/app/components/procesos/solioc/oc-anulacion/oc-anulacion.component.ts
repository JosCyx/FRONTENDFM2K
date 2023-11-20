import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-oc-anulacion',
  templateUrl: './oc-anulacion.component.html',
  styleUrls: ['./oc-anulacion.component.css']
})
export class OcAnulacionComponent {

  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() estadoSol!: string;

  constructor(private sharedService: SharedService) {}

  /*enviarCotizacion(){
    this.sharedService.aprobaroc();
  }

  anularCotizacion(){
    this.sharedService.anularoc();
  }

  noAutorizarCotizacion(){
    this.sharedService.noautorizaroc();
  }*/


}
