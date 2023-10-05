import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;

  setDestino: boolean = false;

  constructor() { }
}
