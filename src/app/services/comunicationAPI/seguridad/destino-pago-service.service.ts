import { HttpClient, HttpHeaders,HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinoPagoServiceService {

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
      'Authorization': `Bearer ${authToken}`
    });
  }


  agregarEvidenciaPago(data: any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/DestinoSolPagos`,data,{headers:headers}); 
  }
}
