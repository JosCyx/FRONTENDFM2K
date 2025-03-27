import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalAusService {

  creationMode: boolean = true;
  idAusentismoSelected: number = 0;

  autObservacion: string = "";


}
