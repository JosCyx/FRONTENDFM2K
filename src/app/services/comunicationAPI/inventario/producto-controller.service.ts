import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoControllerService {

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
          //console.log("Url nomina service:", this.APIUrl);
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

  getProdSector(sector: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/InvProducto/GetProdData/?sector=${sector}`, { headers: this.getHeadersWithAuthToken() });
  }

  getProductoData(sector: number, producto: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/InvProducto/GetProducto/?sector=${sector}&producto=${producto}`, { headers: this.getHeadersWithAuthToken() });
  }

  getProdMov(producto: number, sector: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/InvProducto/GetMovData/?producto=${producto}&sector=${sector}`, { headers: this.getHeadersWithAuthToken() });
  }

  insertProduct(product: any, grupo: number): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}/InvProducto/InsertProduct?grupo=${grupo}`, product, { headers: this.getHeadersWithAuthToken() });
  }

  deleteProduct(producto: number, sector: number): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}/InvProducto/DeleteProductAsign/?producto=${producto}&sector=${sector}`, { headers: this.getHeadersWithAuthToken() });
  }
}
