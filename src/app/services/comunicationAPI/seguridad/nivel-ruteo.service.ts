import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class NivelRuteoService {

  readonly APIUrl = this.globalService.APIUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private globalService: GlobalService
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

  addnivelRuteo(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/NivelesRuteos', data, { headers: headers });
  }

  getNivelruteo(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/NivelesRuteos', { headers: headers });
  }

  //devuelve los niveles que tengan como estado el valor indicado en el parametro
  getNivelbyEstado(estadoRuteo: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any[]>(`${this.APIUrl}/NivelesRuteos/GetNivelByEstado?estadoRuteo=${estadoRuteo}`, { headers: headers });
  }
  
}
