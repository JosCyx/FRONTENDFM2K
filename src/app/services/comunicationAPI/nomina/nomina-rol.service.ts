import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class NominaRolService {
  APIUrl = this.globalService.APIUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) {
    this.globalService.getConfigLoadedObservable().subscribe(
      (configLoaded) => {
        if (configLoaded) {
          this.APIUrl = this.globalService.getApiUrl();
          //console.log("Url nomina service:", this.APIUrl);
          // Ahora puedes usar apiUrl de manera segura.
        }
      }
    );
   }

  private getHeadersWithAuthToken(): HttpHeaders {
    // Obtiene el token de la cookie
    const authToken = this.cookieService.get('authToken');

    // Define las cabeceras de la solicitud con el token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }


  getNominaRolList(fecha: any): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/Nomina/GetRolNominabyFecha?fecha=${fecha}` , { headers: headers });
  }

  sendRolNomina(fecha: any): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post<any>(`${this.APIUrl}/Nomina/SendMailPdf?fechaRol=${fecha}` , { headers: headers });
  }

  sendOnePdf(fecha: any, ruc: any): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post<any>(`${this.APIUrl}/Nomina/SendOnePdf?fechaRol=${fecha}&ruc=${ruc}` , { headers: headers });
  }

}

