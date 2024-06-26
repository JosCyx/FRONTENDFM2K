import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
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

  getEmpleadosList(): Observable<any[]> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/Empleadoes', { headers: headers });
  }

  updateEmpelado(empId: number | string, data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(this.APIUrl + `/Empleadoes/${empId}`, data, { headers: headers });
  }

  addEmpleados(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/Empleadoes', data, { headers: headers });
  }
  
  updateEmpleados(tabla: string){
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + `/Empleadoes/UpdateEmpleados?nombreTabla=${tabla}`, { headers: headers });
  }
  
  getEmpleadoById(empleadoId: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + `/Empleadoes/${empleadoId}`, { headers: headers });
  }

  getEmpleadobyArea(area: number) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any[]>(`${this.APIUrl}/Empleadoes/GetEmpleadobyArea?area=${area}`, { headers: headers });
  }

  getEmpleadoByNomina(nomina: string) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any[]>(`${this.APIUrl}/Empleadoes/GetEmpleadobyNomina?nomina=${nomina}`, { headers: headers });
  }

}
