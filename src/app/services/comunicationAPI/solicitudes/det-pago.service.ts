import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DetPagoService {
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

  //*ADD Detalle de solicitud de pago
  addSolDetPago(data:any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/DetSolPagoes', data, { headers: headers });
  }

  //*Actualiza el ID del  detalle de solicitud de pago
  updatedetpago( id:number, data:any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/DetSolPagoes/${id}`, data, { headers: headers });
  }
}
