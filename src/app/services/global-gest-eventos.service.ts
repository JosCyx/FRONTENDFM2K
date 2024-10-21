import { Injectable } from '@angular/core';
import { FichaGestEventoService } from './comunicationAPI/gest-eventos/ficha-gest-evento.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalGestEventosService {
  
  
  idEventoSelected: number = 0;

  editMode: boolean = false;

  
  
  constructor(
  ) {
   }





  
}
