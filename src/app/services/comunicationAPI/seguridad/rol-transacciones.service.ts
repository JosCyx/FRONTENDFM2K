import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RolTransaccionesService {
  readonly APIUrl = "https://localhost:7086/api";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private getHeadersWithAuthToken(): HttpHeaders {
    // Obtiene el token de la cookie
    const authToken = this.cookieService.get('authToken');

    // Define las cabeceras de la solicitud con el token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }
  //Obtener id de RolTransaccion
  getTransaccionesbyRol(rol: number): Observable<any[]>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/RolTransaccions/GetTransaccionbyRol?rtRol=${rol}`, { headers: headers });
  }
  //agregar transaccion a rol
  addTransaccionRol(val: any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/RolTransaccions', val, { headers: headers });
  }
  //Eliminiar transaccion de rol
  deleteTransaccionRol(id:number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(this.APIUrl + `/RolTransaccions/${id}`, { headers: headers });
  }

}
