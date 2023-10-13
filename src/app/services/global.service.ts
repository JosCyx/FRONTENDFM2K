import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly APIUrl = "http://192.168.1.243:9192/api";

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;

  setDestino: boolean = false;

  constructor() { }
}
