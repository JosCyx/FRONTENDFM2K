import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class NivGerenciaService {
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

  getNivGerencias() : Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/EmplNivels', { headers: headers });
  }

  getNivGerenciasByDep(dep: number, niv: number) : Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/EmplNivels/GetEmplByDep?dep=${dep}&nivel=${niv}`, { headers: headers });
  }

  addNivGerencia(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/EmplNivels', data, { headers: headers });
  }

  deleteNivGerencia(id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(this.APIUrl + '/EmplNivels/' + id, { headers: headers });
  }

  updateNivGerencia(data: any, id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + '/EmplNivels/' + id, data, { headers: headers });
  }
}
