import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

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

  getUsuariosList(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/Usuarios', { headers: headers });
  }

  getUsuariosbyId(idNomina: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/Usuarios/BuscarUsuariobyIdNomina?idNomina=${idNomina}`, { headers: headers });
  }

  searchUsuarios(tipoBusq: number, termBusq: string): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/Usuarios/BuscarUsuario?tipoBusqueda=${tipoBusq}&terminoBusqueda=${termBusq}`, { headers: headers });
  }

  addNewUsuario(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/Usuarios', data, { headers: headers });
  }

  editUsuario(idNomina: number,data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/Usuarios/${idNomina}`, data, { headers: headers });
  }
}
