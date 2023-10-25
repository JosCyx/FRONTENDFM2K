import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';


@Injectable({
  providedIn: 'root'
})
export class CabPagoService {
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

  //retorna todas las solicitudes de pago
  getAllPago(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/CabSolPago', { headers: headers });
  }

  getPagobyArea(area: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolPago/GetCabecerabyarea?area=${area}`, { headers: headers });
  }

  getPagobyIdNomina(id: string): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolPago/GetCabecerabyNomina?idNomina=${id}`, { headers: headers });
  }



  //*METODO Cabecera SOLICITUD DE PAGO
  addSolPag(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/CabSolPago', data, { headers: headers });
  }

  //*Buscar el ID por cabecera y detalle de solicitud de pago 
  getSolPagobyId(id: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/CabSolPago/GetSolicitudByID?ID=${id}`, { headers: headers });
  }

  //*Actualiza el ID por cabecera de solicitud de pago 
  updatecabPago(id:number,data:any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolPago/${id}`, data, { headers: headers });
  }
  //Obtener estado de pago  de A Y C
  getEstadoPago(states:string){
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/CabSolPago/GetSOEstado?state=${states}`, { headers: headers });

  }


  //metodos para cambiar de estado el tracking
  updateEstadoTRKCotizacion(tipoSol: number, noSol: number, estado: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolPago/UpdateEstadoTracking?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateEstadoCotizacion(tipoSol: number, noSol: number, estado: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolPago/UpdateEstado?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateAprobadoCotizacion(tipoSol: number, noSol: number, id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolPago/UpdateAprobado?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }

  updateFinancieroCotizacion(tipoSol: number, noSol: number, id: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolPago/UpdateFinanciero?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }
}
