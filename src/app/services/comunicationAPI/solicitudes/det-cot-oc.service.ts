import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DetCotOCService {
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

  getLastDetalleCot(tipoSol: number, noSol: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/DetSolCotizacions/GetLastDetalleCot?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }

  addDetalleCotizacion(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/DetSolCotizacions', data, { headers: headers });
  }

  deleteAllDetBySol(tipoSol: number, noSol: number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/DetSolCotizacions/DeleteAllDetails?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }

  deleteDetallebyId(id:number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(this.APIUrl + `/DetSolCotizacions/${id}`, { headers: headers });
  }

  getLastDetalleID():Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/DetSolCotizacions/GetLastDetalleID', { headers: headers });
  }

  //Procedimiento de GetDetalle_solicitud
  getDetalle_solicitud(tipoSol: number, noSol: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/DetSolCotizacions/GetDetalleSolicitud?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }
}
