import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //COMUNICACION CON LA API PARA REALIZAR EL LOGIN
  readonly APIurl = 'https://localhost:7086/api';

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  login(user: string, pass: string){
    // Crea un objeto con los datos del usuario y la contraseña
    const body = {
      username: user,
      pass: pass
    };

    // Realiza una solicitud POST al endpoint /Usuarios/Login
    return this.http.post(this.APIurl + '/Login', body);
  }

  isAuthenticated():boolean{
    const token = this.cookieService.get('authToken');

    if(!token){
      console.log("NO AUTENTICADO");
      return false;
    }

    
    try {
      const decodedToken: any = jwt_decode(token);

      // Verifica si la fecha de expiración (exp) del token es posterior a la hora actual
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTimestamp) {
        //console.log("SI AUTENTICADO");
        return true; // El token no ha expirado, el usuario está autenticado
      } else {
        console.log("NO AUTENTICADO, EXPIRADO");
        return false; // El token ha expirado, el usuario no está autenticado
      }
    } catch (error) {
      console.log("ERROR AL VERIFICAR TOKEN");
      return false; // Error al decodificar el token, el usuario no está autenticado
    }
    
  }
}
