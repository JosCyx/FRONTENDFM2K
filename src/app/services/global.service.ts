import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLogin: boolean = false;
  admin: boolean = false;
  sol: boolean = false;
  appSelected: boolean = false;

  constructor() { }
}
