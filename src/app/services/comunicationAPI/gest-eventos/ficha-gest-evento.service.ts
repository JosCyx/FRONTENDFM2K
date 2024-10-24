import { Injectable } from '@angular/core';
import { GlobalService } from '../../global.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichaGestEventoService {

  APIUrl = this.globalService.APIUrl;
  
  constructor(
    private globalService: GlobalService,
    private http: HttpClient,
    private cookieService: CookieService


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

  

  postFichaGestEvento(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevEvento`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postFecha(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevFechas`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postTipoFecha(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevTipoFecha`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postEstado(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/EGestevEstado`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postArea(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevAreas`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postClientes(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevClientes`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postEncargado(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevEncargado`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postEstadoProceso(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevEstadoProceso`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postProyecto(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevProyecto`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postTipoContrato(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevTipoContrato`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postTipoPago(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevTipoPago`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postCuotas(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/GestevCuotas`, data, { headers: this.getHeadersWithAuthToken() });
  }

  getFichaGestEventoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevEvento`, { headers: this.getHeadersWithAuthToken() });
  }

  getClientesList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevClientes`, { headers: this.getHeadersWithAuthToken() });
  }

  getLocalidadList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevLocalidad`, { headers: this.getHeadersWithAuthToken() });
  }

  getTipoContratoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevTipoContrato`, { headers: this.getHeadersWithAuthToken() });
  }

  getEmpleadoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Empleadoes`, { headers: this.getHeadersWithAuthToken() });
  }

  getTipoFechaList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevTipoFecha`, { headers: this.getHeadersWithAuthToken() });
  }

  getTipoPagoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevTipoPago`, { headers: this.getHeadersWithAuthToken() });
  }
  
  getFichaGestEventoById(id: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevEvento/${id}`, { headers: this.getHeadersWithAuthToken() });
  }

  getFechasById(id: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevFechas/${id}`, { headers: this.getHeadersWithAuthToken() });
  }
  
  //obtener los datos de los eventos para el calendario
  getCalendarData(): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevEvento/GetEvCalendarData`, { headers: this.getHeadersWithAuthToken() });
  }

  //obtener los datos del evento seleccionado del calendario
  getOneEventData(id: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/GestevEvento/GetOneEvData/${id}`, { headers: this.getHeadersWithAuthToken() });
  }

  // updateEstadoProceso(idficha: number, estado: number, sttoped: number = 0): Observable<any> {
  //   return this.http.put(`${this.APIUrl}/GestevEstadoProceso/UpdateStatusFicha?idFicha=${idficha}&status=${estado}&sttoped=${sttoped}`, { headers: this.getHeadersWithAuthToken() });
  // }

  // updateEstado(data: any): Observable<any> {
  //   return this.http.put(`${this.APIUrl}/GestevEstado/UpdateStatusReq?idFicha=${data.idFicha}&idReq=${data.idReq}&status=${data.status}&observ=${data.observ}`, { headers: this.getHeadersWithAuthToken() });
  // }

}
