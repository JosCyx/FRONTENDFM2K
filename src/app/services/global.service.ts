import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  //url de la API publicada
  //readonly APIUrl = "http://192.168.1.234:9192/api";

  readonly APIUrl = "https://localhost:7086/api";

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;

  setDestino: boolean = false;

  
  // Otras propiedades...

  constructor(private http: HttpClient) {}

  //src/assets/configfm2k.json
  
}
