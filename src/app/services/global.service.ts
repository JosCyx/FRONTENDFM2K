import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLogin: boolean = false;
  appSelected: boolean = false;

  constructor() { }
}
