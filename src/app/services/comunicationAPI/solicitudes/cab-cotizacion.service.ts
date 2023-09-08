import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CabCotizacionService {
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

  addSolCot(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/CabSolCotizacions', data, { headers: headers });
  }

  // getIDCabecera(tipoSol: number, noSol: number): Observable<any> {
  //   return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetCabecerabyID?tipoSol=${tipoSol}&noSol=${noSol}`);
  // }

  //retorna todas las solicitudes de cotizacion
  getAllCotizaciones(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/CabSolCotizacions', { headers: headers });
  }

  getCotizacionbyId(id: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetSolicitudByID?ID=${id}`, { headers: headers });
  }

  updateCabCotizacion( id:number,data:any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/${id}`,data, { headers: headers });
  }
}
