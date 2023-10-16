import { Component, Input} from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cot-anulacion',
  templateUrl: './cot-anulacion.component.html',
  styleUrls: ['./cot-anulacion.component.css']
})
export class CotAnulacionComponent {

  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() estadoSol!: string;

  constructor(private sharedService: SharedService) {}

  enviarCotizacion(){
    this.sharedService.aprobar();
  }

  anularCotizacion(){
    this.sharedService.anular();
  }

  noAutorizarCotizacion(){
    this.sharedService.noautorizar();
  }

}
