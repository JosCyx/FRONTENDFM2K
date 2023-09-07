import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CabOrdCompraService {
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

  addSolOC(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/CabSolOrdenCompras', data, { headers: headers });
  } 

  //retorna todas las solicitudes de orden de compra
  getAllOrdenCmp(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/CabSolOrdenCompras', { headers: headers });
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
}
