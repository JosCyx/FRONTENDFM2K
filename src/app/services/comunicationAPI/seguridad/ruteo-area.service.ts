import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class RuteoAreaService {
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

  getRuteos(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/RuteoAreas', { headers: headers });
  }

  addRuteos(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/RuteoAreas', data, { headers: headers });
  }

  checkRuteoExistence(rutTipoSol: number, rutArea: number, rutNivel: number): Observable<boolean> {
    const headers = this.getHeadersWithAuthToken();
    const url = `${this.APIUrl}/RuteoAreas/checkRuteoExistence?rutTipoSol=${rutTipoSol}&rutArea=${rutArea}&rutNivel=${rutNivel}`;
    return this.http.get<boolean>(url, { headers: headers });
  }

  getRuteosByArea(rutArea: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/RuteoAreas/${rutArea}`, { headers: headers });
  }

  //elimina un ruteo segun su area, tipo de solicitud y nivel
  deleteRuteo(RutareaTipoSol: number, RutareaArea: number, RutareaNivel: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete<any>(`${this.APIUrl}/RuteoAreas/${RutareaTipoSol},${RutareaArea},${RutareaNivel}`, { headers: headers });
  }
}
