import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

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



  //
  uploadFile(bodys:FormData,prefijo:string,tiposol:number,nolSol:number):Observable<any>{
    return this.http.post(`${this.APIUrl}/Documento/upload?prefijo=${prefijo}&tipoSOl=${tiposol}&noSol=${nolSol}`,bodys);

  }
  getFile(tipoSol:number,noSol:number):Observable<any[]>{
    return this.http.get<any>(`${this.APIUrl}/Documento/GetDocumentos?tipoSol=${tipoSol}&noSol=${noSol}`);
  }

}
