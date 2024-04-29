import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class AlertEventService {

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

  addAlertEvent(data: any): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.post<any>(this.APIUrl + '/AlertaEvento/PostComintAlertaEvento', data, { headers: headers });
  }

  addImageAlertEvent(image: FormData, idAlerta: number, asunto: string, rw: boolean, bkId: number, ): Observable<any> {
    //const headers = this.getHeadersWithAuthToken();
    const headers = new HttpHeaders();
    
    headers.append('Content-Type', 'multipart/form-data');
    const encodedAsunto = encodeURIComponent(asunto);
    return this.http.post(`${this.APIUrl}/AlertImages/UploadAlertImage?idAlert=${idAlerta}&subj=${encodedAsunto}&rw${rw}&bkId${bkId}`, image, { headers: headers });
  }

  addProgramAlertEvent(data: any): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.post<any>(this.APIUrl + '/ProgramacionAlertas', data, { headers: headers });
  }

  getAlertEvents(): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/AlertaEvento', { headers: headers });
  }

  getAlertEventById(id: number): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/AlertaEvento/' + id, { headers: headers });
  }

  //editar alerta
  putAlertEvent(id: number, data: any): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.put<any>(this.APIUrl + '/AlertaEvento/' + id, data, { headers: headers });
  }

  putProgramAlertEvent(id: number, data: any): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.put<any>(this.APIUrl + '/ProgramacionAlertas/' + id, data, { headers: headers });
  }
}
