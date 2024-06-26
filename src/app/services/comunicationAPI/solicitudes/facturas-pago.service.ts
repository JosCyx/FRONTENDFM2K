import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class FacturasPagoService {
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

  addFacturaPago(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/FacturaSolPagoes', data, { headers: headers });
  }

  addDetallePago(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/FacturaSolPagoes/DetalleFacturaPago', data, { headers: headers });
  }

  updateFacturaPago(noSol: number | undefined, noFact: number | undefined, data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/FacturaSolPagoes/UpdateFactura?noSol=${noSol}&noFact=${noFact}`, data, { headers: headers });
  }

  updateDetalleFactura(idFacDet: number | undefined, noDet: number | undefined, data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/FacturaSolPagoes/UpdateDetalleFactura?idFacDet=${idFacDet}&noDet=${noDet}`, data, { headers: headers });
  }

  changeEstadoFactura(noSol: number | undefined, noFact: string | undefined, estado: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/FacturaSolPagoes/ChangeEstadoFactura?noSol=${noSol}&noFact=${noFact}&estado=${estado}`, { headers: headers });
  }

  postOCTemplateAX(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/FacturaSolPagoes/OCTemplateAX', data, { headers: headers });
  }

}
