import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  appSelected: boolean = false;

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;

  constructor() { }

  

}
