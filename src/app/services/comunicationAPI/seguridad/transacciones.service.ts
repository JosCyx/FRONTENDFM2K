import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

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
  //obtener lista de transacciones
  getTransaccionesList(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/Transacciones' , { headers: headers });
  }
  //agregar transacciones
  addtransacciones(val: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/Transacciones', val, { headers: headers });    
  }
  //actualizar transacciones
  updatetransacciones(codi:number,val: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/Transacciones/${codi}`, val, { headers: headers });    
  }
}
