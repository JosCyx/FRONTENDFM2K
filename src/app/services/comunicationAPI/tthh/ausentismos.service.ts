import { Injectable } from '@angular/core';
import { GlobalService } from '../../global.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AusentismosService {
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

     getAusSolicitante(usuario: string, fechaInicio: Date, fechaFin: Date): Observable<any> {
         console.log(this.APIUrl);
         const headers = this.getHeadersWithAuthToken();
         const fechaInicioString = fechaInicio.toISOString().split('T')[0];
        const fechaFinString = fechaFin.toISOString().split('T')[0];
        return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${1}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}&solcitante=${usuario}`, {headers: headers });
     }

      getJefeInmediato(jefeInmediato: string, fechaInicio: Date, fechaFin: Date): Observable<any> {
          console.log(this.APIUrl);
          const headers = this.getHeadersWithAuthToken();
          const fechaInicioString = fechaInicio.toISOString().split('T')[0];
        const fechaFinString = fechaFin.toISOString().split('T')[0];
        return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${2}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}&jefeInmediato=${jefeInmediato}`, {headers: headers });
      }

      getAusbyArea(area: number, fechaInicio: Date, fechaFin: Date): Observable<any> {
        console.log(this.APIUrl);
        const headers = this.getHeadersWithAuthToken();
        const fechaInicioString = fechaInicio.toISOString().split('T')[0];
        const fechaFinString = fechaFin.toISOString().split('T')[0];
        return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${3}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}&area=${area}`, {headers: headers });
      }
      
      getAllforAdmin(fechaInicio: Date, fechaFin: Date): Observable<any> {
        console.log(this.APIUrl);
        const headers = this.getHeadersWithAuthToken();
        const fechaInicioString = fechaInicio.toISOString().split('T')[0];
        const fechaFinString = fechaFin.toISOString().split('T')[0];
        return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${4}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`, {headers: headers });
      }
}
