import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//interfaz para cerar objetos donde guardar los datos del usuario autenticado
interface UserData {
  nombres: any;
  apellidos: any;
  identificacion: any;
  rol: any;
  area: any;
  dpto: any;
  correo: any;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userData!: UserData;

  readonly APIurl = 'https://localhost:7086/api';

  constructor(private http: HttpClient) { }

  login(user: string, pass: string){
    return this.http.get(this.APIurl + '/Usuarios');
  }
}
