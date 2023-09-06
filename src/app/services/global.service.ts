import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  appSelected: boolean = false;

  solView: string = 'crear'; 
  solID: number = 0;

  constructor() { }

  

}
