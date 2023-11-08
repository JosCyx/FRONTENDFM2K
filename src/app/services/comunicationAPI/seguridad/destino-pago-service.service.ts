import { HttpClient, HttpHeaders,HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class DestinoPagoServiceService {

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
      'Authorization': `Bearer ${authToken}`
    });
  }

  agregarEvidenciaPago(data: any){
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/DestinoSolPagos`,data,{headers:headers}); 
  }

  getEvidenciasBySolicitud(tiposol: number, nosol: number):Observable<any[]>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<[]>(`${this.APIUrl}/DestinoSolPagos/GetDestinoPagoBySolicitud?tiposol=${tiposol}&nosol=${nosol}`,{headers:headers}); 

  }

  getImage(path: string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/DestinoSolPagos/GetImage?filePath=${path}`,{headers:headers, responseType: 'blob'}); 
  }

  deleteEvidencia(tipoSol: number, noSol: number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/DestinoSolPagos/DeleteDestinoSolPagoBySolicitud?tiposol=${tipoSol}&nosol=${noSol}`,{headers:headers});
  }
}
