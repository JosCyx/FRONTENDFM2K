import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
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
