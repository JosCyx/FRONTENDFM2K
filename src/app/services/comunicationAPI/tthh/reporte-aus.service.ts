import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';
import { Observable } from 'rxjs';

interface Resultado {
  Nombre: string;
  Total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReporteAusService {
  APIUrl = this.globalService.APIUrl;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) {
    this.globalService.getConfigLoadedObservable().subscribe((configLoaded) => {
      if (configLoaded) {
        this.APIUrl = this.globalService.getApiUrl();
        //console.log("Url service:", this.APIUrl);
        // Ahora puedes usar apiUrl de manera segura.
      }
    });
  }
  private getHeadersWithAuthToken(): HttpHeaders {
    // Obtiene el token de la cookie
    const authToken = this.cookieService.get('authToken');

    // Define las cabeceras de la solicitud con el token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  getReporteAusentismo(
    fechaInicio: any,
    fechaFin: any,
    operacion: number
  ): Observable<Resultado> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(
      `${this.APIUrl}/Ausentismos/ReporteAusentismo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&operacion=${operacion}`,
      { headers: headers }
    );
  }
}
