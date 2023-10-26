import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
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

  getRolsList(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any[]>(this.APIUrl + '/Rols', { headers: headers });
  }

  getRolById(Rocodigo: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/Rols/${Rocodigo}`, { headers: headers });
  }

  addRols(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/Rols', data, { headers: headers });
  }

  updateRols(Rocodigo: number | string, data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/Rols/${Rocodigo}`, data, { headers: headers });
  }

  deleteRols(Rocodigo: number | string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(this.APIUrl + `/Rols/${Rocodigo}`, { headers: headers });
  }
}
