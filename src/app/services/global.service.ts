import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  //url de la API publicada
  //readonly APIUrl = "http://192.168.1.243:9192/api";
  readonly APIUrl = "https://localhost:7086/api";

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;

  setDestino: boolean = false;

  constructor() { }
}
