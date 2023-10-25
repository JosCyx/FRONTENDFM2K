import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class CabOrdCompraService {
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

  addSolOC(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/CabSolOrdenCompras', data, { headers: headers });
  } 

  //retorna todas las solicitudes de orden de compra
  getAllOrdenCmp(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/CabSolOrdenCompras', { headers: headers });
  }

  getOrdenCmpbyArea(area: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/GetCabecerabyarea?area=${area}`, { headers: headers });
  }

  getOrdenCmpbyIdNomina(id: string): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/GetCabecerabyNomina?idNomina=${id}`, { headers: headers });
  }


  getOrdenOC(tipoSol: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/${tipoSol}`, { headers: headers });
  }

  getOrdenComprabyId(id: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/GetSolicitudByID?ID=${id}`, { headers: headers });
  }

  updateOrdencompra( id:number,data:any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/${id}`, data, { headers: headers });
  }
  //Obtener estado de orden compra  de A Y C 
  getEstadoOrdenC(states:string){
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/CabSolOrdenCompras/GetOCEstado?state=${states}`, { headers: headers });

  }

  //metodos para cambiar de estado el tracking
  updateEstadoTRKCotizacion(tipoSol: number, noSol: number, estado: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/UpdateEstadoTracking?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateEstadoCotizacion(tipoSol: number, noSol: number, estado: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/UpdateEstado?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateAprobadoCotizacion(tipoSol: number, noSol: number, id: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/UpdateAprobado?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }

  updateFinancieroCotizacion(tipoSol: number, noSol: number, id: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/UpdateFinanciero?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }
}
