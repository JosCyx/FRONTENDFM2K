import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class FichaEventoService {

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
          //console.log("Url impresa:", this.APIUrl);
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


  getFichaEventoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento`, { headers: this.getHeadersWithAuthToken() });
  }


  getFechaInicioList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento/fEvFechaInicio`, { headers: this.getHeadersWithAuthToken() });
  }

  getFechaFinList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento/fEvFechaFin`, { headers: this.getHeadersWithAuthToken() });
  }

  // getAreaList(): Observable<any> {
  //   return this.http.get(`${this.APIUrl}/Areas`, { headers: this.getHeadersWithAuthToken() });
  // }

  // getSectorList(): Observable<any> {
  //   return this.http.get(`${this.APIUrl}/GetSectoresList`, { headers: this.getHeadersWithAuthToken() });
  // }
}
