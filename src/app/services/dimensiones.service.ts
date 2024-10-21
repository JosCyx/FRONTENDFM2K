import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class DimensionesService {
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

  getDimPresupuesto(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimPresp`, { headers: this.getHeadersWithAuthToken() });
  }

  getDimSubAct(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimSubAct`, { headers: this.getHeadersWithAuthToken() });
  }

  getDimAct(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimAct`, { headers: this.getHeadersWithAuthToken() });
  }

  /*getDimActBySect(idSect: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimActBySect?idSect=${idSect}`, { headers: this.getHeadersWithAuthToken() });
  }*/

  getDimSect(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimSect`, { headers: this.getHeadersWithAuthToken() });
  }

  /*getDimSectByPr(idPr: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimSectByPr?idPr=${idPr}`, { headers: this.getHeadersWithAuthToken() });
  }*/

  getDimProyecto(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimProyecto`, { headers: this.getHeadersWithAuthToken() });
  }

  /*getDimByPresp(prespId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimByPresp/${prespId}`, { headers: this.getHeadersWithAuthToken() });
  }*/

  postSolDimensiones(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/Dimensiones/PostSolDimensiones`, data, { headers: this.getHeadersWithAuthToken() });
  }

  //agregar el numero de orden de compra y el valor de la solicitud
  updateSolDimensiones(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/Dimensiones/UpdateSolDimensiones`, data, { headers: this.getHeadersWithAuthToken() });
  }

  //obtener reporte de egresos
  getProjectSalesReport(presp: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetProjectSalesReport?presp=${presp}&startDate=${startDate}&endDate=${endDate}`, {
      headers: this.getHeadersWithAuthToken()
    });
  }

  getPSARelations(): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetPSARelations`, { headers: this.getHeadersWithAuthToken() });
  }


  
  addPSARelation(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/Dimensiones/AddPSARelation`, data, { headers: this.getHeadersWithAuthToken() });
  }

  deletePSARelation(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/Dimensiones/DeletePSARelation?id=${id}`, { headers: this.getHeadersWithAuthToken() });
  }

  getSectorPSA(idPr: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetSectorPSA?idPr=${idPr}`, { headers: this.getHeadersWithAuthToken() });
  }

  getActividadesPSA(idPr: number, idSect: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetActividadesPSA?idPr=${idPr}&idSect=${idSect}`, { headers: this.getHeadersWithAuthToken() });
  }

  getDimSolInfo(tipoSol: number, noSol: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimBySol?tipoSol=${tipoSol}&idSol=${noSol}`, { headers: this.getHeadersWithAuthToken() });
  }

  getDimNamesBySol(tipoSol: number, noSol: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/Dimensiones/GetDimNamesBySol?tipoSol=${tipoSol}&numSol=${noSol}`, { headers: this.getHeadersWithAuthToken() });
  }
}



