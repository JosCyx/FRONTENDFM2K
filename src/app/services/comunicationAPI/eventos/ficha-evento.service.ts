import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class FichaEventoService {

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

  postFichaEvento(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/EvFichaEvento`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postRiesgoFichaEvento(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/EvRiesgosPr`, data, { headers: this.getHeadersWithAuthToken() });
  }

  postRequerimentsFichaEv(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/EvRequerimientosEto`, data, { headers: this.getHeadersWithAuthToken() });
  }

  getFichaEventoList(): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento`, { headers: this.getHeadersWithAuthToken() });
  }

  getFichaEventoById(id: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento/${id}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateEstadoFichaEvento(idficha: number, estado: number, sttoped: number = 0): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvFichaEvento/UpdateStatusFicha?idFicha=${idficha}&status=${estado}&sttoped=${sttoped}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateEstadoRequerimiento(data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvRequerimientosEto/UpdateStatusReq?idFicha=${data.idFicha}&idReq=${data.idReq}&status=${data.status}&observ=${data.observ}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateCheckRequerimiento(data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvRequerimientosEto/UpdateCheckReq?idFicha=${data.idFicha}&idReq=${data.idReq}&check=${data.check}&observ=${data.observ}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateFichaEvValido(idFicha: number, status: number): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvFichaEvento/UpdateFichaEvValido?idFicha=${idFicha}&status=${status}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateEstadoValidoRequerimiento(data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvRequerimientosEto/UpdateValidStatusReq?idFicha=${data.idFicha}&idReq=${data.idReq}&status=${data.status}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateReqObserv(data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/EvRequerimientosEto/UpdateObservReq?idFicha=${data.idFicha}&idReq=${data.idReq}&observ=${data.observ}`, { headers: this.getHeadersWithAuthToken() });
  }

  postFichaDocs(file: any, idFicha: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('doc', file);  
    formData.append('idFicha', idFicha.toString());

    // Obtener los encabezados sin 'Content-Type'
    let headers = this.getHeadersWithAuthToken();
    headers = headers.delete('Content-Type');

    return this.http.post(`${this.APIUrl}/EvFichaDocumentos/UploadFichaDoc`, formData, {
      headers: headers,
    });
  }

  postSubsDocs(file: any, idFicha: number, idSubs: number, user: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('doc', file);
    formData.append('idFicha', idFicha.toString());
    formData.append('idSubs', idSubs.toString());
    formData.append('user', user);

    formData.forEach((value, key) => {
      console.log(key + ' ' + value);
    });
  
    // Obtener los encabezados sin 'Content-Type'
    let headers = this.getHeadersWithAuthToken();
    headers = headers.delete('Content-Type');
  
    return this.http.post(`${this.APIUrl}/EvReqDocumentos/UploadReqDoc`, formData, {
      headers: headers,
    });
  }
  

  getViewFileEv(path: string): Observable<any> {
    // Codifica la URL para que los caracteres especiales se manejen correctamente
    const encodedPath = encodeURIComponent(path);
  
    // Envía la solicitud GET a la API
    return this.http.get(`${this.APIUrl}/Documento/ViewEvFile?filePath=${encodedPath}`, { responseType:'blob' });
  }
  
  getNextFichaStatus(idFicha: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento/GetNextStatus?idFicha=${idFicha}`, { headers: this.getHeadersWithAuthToken() });
  }

  postDeleteEvFile(idDoc: number, type: number):Observable<any>{
    return this.http.get(`${this.APIUrl}/Documento/DeleteEvFile?id=${idDoc}&type=${type}`, { headers: this.getHeadersWithAuthToken() });
  }

  updateFichaJustify(idFicha: number, justify: string):Observable<any>{
    return this.http.put(`${this.APIUrl}/EvFichaEvento/UpdateFichaJustify?idFicha=${idFicha}&justify=${justify}`, { headers: this.getHeadersWithAuthToken() });
  } 

  updateFichasPercent():Observable<any>{
    return this.http.get(`${this.APIUrl}/EvFichaEvento/CalculateFichaEvPorcentages`, { headers: this.getHeadersWithAuthToken() });
  }

  getLevelEnabled(idEmp: string): Observable<any> {
    return this.http.get(`${this.APIUrl}/EvFichaEvento/GetLevelEnabled?idNomina=${idEmp}`, { headers: this.getHeadersWithAuthToken() });
  }


}
