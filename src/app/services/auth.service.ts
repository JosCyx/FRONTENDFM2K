import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //DATOS DEL USUARIO PARA REALIZAR AUTORIZACION
  userLogin!: string;
  userIdNomina!: number;

  //COMUNICACION CON LA API PARA REALIZAR EL LOGIN
  readonly APIurl = 'https://localhost:7086/api';

  constructor(private http: HttpClient) { }


  login(user: string, pass: string){
    // Crea un objeto con los datos del usuario y la contraseña
    const body = {
      username: user,
      pass: pass
    };


    // Realiza una solicitud POST al endpoint /Usuarios/Login
    return this.http.post(this.APIurl + '/Usuarios/Login', body);
  }
}
