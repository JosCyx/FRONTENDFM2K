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

  getAllSolicitudes(tipoSol: number, maxNivel: number, idNomina: string, idArea: number): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/AllSolicitudes/GetAllRequest?tipoSolicitud=${tipoSol}&maxNivel=${maxNivel}&idNomina=${idNomina}&idArea=${idArea}`, { headers: headers });
  }

  /*addSolCot(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/CabSolCotizacions', data, { headers: headers });
  }*/
  
  
  addSolCot(data: any, idEmpleado: string, tipoRuteo: string) {
    const headers = this.getHeadersWithAuthToken();

    // Crear la URL con los parámetros de idEmpleado y tipoRuteo
    const url = `${this.APIUrl}/CabSolCotizacions?idEmpleado=${idEmpleado}&tipoRuteo=${tipoRuteo}`;

    // Realizar la solicitud POST con la URL que incluye los parámetros
    return this.http.post(url, data, { headers: headers });
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

  getCotizacionesByIdNomina(id: string): Observable<any[]> {
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
  updateEstadoTRKCotizacion(tipoSol: number, noSol: number, estado: number, idEmpleado: string, tipoRuteo: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateEstadoTracking?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}&idEmpleado=${idEmpleado}&tipoRuteo=${tipoRuteo}`,null, { headers: headers });
  }

  updateEstadoCotizacion(tipoSol: number, noSol: number, estado: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateEstado?tipoSol=${tipoSol}&noSol=${noSol}&newEstado=${estado}`,null, { headers: headers });
  }

  updateAprobadoCotizacion(tipoSol: number, noSol: number, id: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateAprobado?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }

  updateFinancieroCotizacion(tipoSol: number, noSol: number, id: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateFinanciero?tipoSol=${tipoSol}&noSol=${noSol}&id=${id}`,null, { headers: headers });
  }

  updateFechaCotizacion(tipoSol: number, noSol: number, fecha: Date) {
    const headers = this.getHeadersWithAuthToken();
    const formattedFecha = fecha.toISOString();
    return this.http.put(`${this.APIUrl}/CabSolCotizacions/UpdateFecha?tipoSol=${tipoSol}&noSol=${noSol}&fecha=${formattedFecha}`, null, { headers: headers });
  }

  updateMotivoDevolucion(tipoSol: number, noSol: number, motivo: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateMotivoDevolucion?tipoSol=${tipoSol}&noSol=${noSol}&motivo=${motivo}`,null, { headers: headers });
  }
  //Metodo eliminar cotizacion , detalles ,item  y documentoss
  DeleteCotizacion(tipoSol: number, noSol: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(this.APIUrl + `/CabSolCotizacions/DeleteCotizacion?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });

  }

  updateSinPresupuesto(tipoSol: number, noSol: number, check: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/CabSolCotizacions/UpdateSinPresupuesto?tipoSol=${tipoSol}&noSol=${noSol}&check=${check}`, { headers: headers });
  }
}

