import { Injectable } from '@angular/core';
import { GlobalService } from '../../global.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AusentismosService {
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
          //console.log("Url service:", this.APIUrl);
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

  getAusentismo(opSelected: number, /*fechaInicio: Date, fechaFin: Date,*/ usuario: string | null = null): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    /*const fechaInicioString = fechaInicio.toISOString().split('T')[0];
    const fechaFinString = fechaFin.toISOString().split('T')[0];
    return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${opSelected}&fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}&solicitante=${usuario}`, { headers: headers });*/
    return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismo?op=${opSelected}&solicitante=${usuario}`, { headers: headers });
  }


  getOpList() {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/AusAdmin/GetOpList`, { headers: headers });
  }

  getMotivosAus(): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/AusAdmin/GetMotivoList`, { headers: headers });
  }

  postAusentismo(data: any): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Ausentismos/InsertarAusentismo`, data, { headers: headers });
  }

  postArchivoAus(idAus: number, file: any, isNew: boolean): Observable<any> {
    const formData = new FormData();
    formData.append('doc', file);
    formData.append('idAus', idAus.toString());
    formData.append('isNew', isNew.toString());

    let headers = this.getHeadersWithAuthToken();
    headers = headers.delete('Content-Type');

    return this.http.post(`${this.APIUrl}/Ausentismos/InsertarArchivo`, formData, { headers: headers });
  }

  getAusentismoById(idAus: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Ausentismos/GetAusentismoById?ausId=${idAus}`, { headers: headers });
  }

  /* downloadAusFile(ruta: string): Observable<Blob> {
     const headers = this.getHeadersWithAuthToken();
     return this.http.get(`${this.APIUrl}/Ausentismos/DownloadAusFile?ruta=${encodeURIComponent(ruta)}`, { 
       headers: headers, 
       responseType: 'blob' 
     });
   }*/

  downloadAusFile(ruta: string) {
    const encodedRuta = encodeURIComponent(ruta);
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Ausentismos/DownloadAusFile?ruta=${encodedRuta}`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  deleteAusFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.APIUrl}/Ausentismos/EliminarArchivo?fileName=${fileName}`);
  }

  getAutorizacion(action: number,ausId:number, usuario:string, comentario:string): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Ausentismos/AutAusentismo?ausentismo=${ausId}&usuario=${usuario}&comentario=${comentario}&action=${action}`, { headers: headers });
  }

////////////////////////////////////////
  postMotivoAus(data: any): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Ausentismos/InsertarMotivoAus`, data, { headers: headers });
  }
  
  postParametro(data: any): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Ausentismos/InsertarParametro`, data, { headers: headers });
  }
  getParamList(): Observable<any> { 
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/AusAdmin/GetParamList`, { headers: headers });
  }
  
  updateParametro(ParamId: number | string, data: any): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(`${this.APIUrl}/Ausentismos/UpdateParametro/${ParamId}`, data, { headers: headers });
  }

  updateMotivoAus(MotId: number | string, data: any): Observable<any> {    
    const headers = this.getHeadersWithAuthToken();
    return this.http.put(`${this.APIUrl}/Ausentismos/updateMotivoAus/${MotId}`, data, { headers: headers });
  }

}
