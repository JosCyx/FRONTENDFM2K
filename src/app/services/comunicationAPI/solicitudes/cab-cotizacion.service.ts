import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class CabCotizacionService {
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

  getCotizacionesbyArea(area: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetCabecerabyarea?area=${area}`, { headers: headers });
  }

  getCotizacionesByIdNomina(id: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetCabecerabyNomina?idNomina=${id}`, { headers: headers });
  }




  getCotizacionbyId(id: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetSolicitudByID?ID=${id}`, { headers: headers });
  }

  updateCabCotizacion(id: number, data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/${id}`, data, { headers: headers });
  }
  //Obtener estado de Cotizacion  de A Y C
  getEstadoCotizacion(states: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/CabSolCotizacions/GetCOTEstado?state=${states}`, { headers: headers });

  }

  //metodos para cambiar de estado el tracking
  updateEstadoTRKCotizacion(tipoSol: number, noSol: number, estado: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateEstadoTracking?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateEstadoCotizacion(tipoSol: number, noSol: number, estado: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateEstado?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateAprobadoCotizacion(tipoSol: number, noSol: number, id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateAprobado?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }

  updateFinancieroCotizacion(tipoSol: number, noSol: number, id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateFinanciero?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }
}

