import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class MarcacionesService {
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
          console.log("Url service:", this.APIUrl);
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

  //get general data
  getGeneralData(usuario: string, fechaInicio: Date, fechaFin: Date): Observable<any> {

    const headers = this.getHeadersWithAuthToken();
    const fechaInicioString = fechaInicio.toISOString().split('T')[0];
    const fechaFinString = fechaFin.toISOString().split('T')[0];
    return this.http.get(`${this.APIUrl}/AusMarcaciones/GetMarcaciones?usuario=${usuario}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`, { headers: headers });
  }

}
