import { HttpClient, HttpHeaders,HttpResponse  } from '@angular/common/http';
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
      'Authorization': `Bearer ${authToken}`
    });
  }


  //
  uploadFile(bodys:FormData,prefijo:string,tiposol:number,nolSol:number):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Documento/upload?prefijo=${prefijo}&tipoSOl=${tiposol}&noSol=${nolSol}`,bodys,{headers:headers});

  }

  uploadPagoDocs(bodys:FormData,prefijo:string, item: string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(`${this.APIUrl}/Documento/UploadSolPagoDocs?prefijo=${prefijo}&item=${item}`,bodys,{headers:headers});

  }

  getFile(tipoSol:number,noSol:number):Observable<any[]>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/Documento/GetDocumentos?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }

  viewFile(filesNombres:string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Documento/ViewFile?fileName=${filesNombres}`, {responseType:'blob'});
  }

  deleteFile(filesNombres:string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/Documento/DeleteFile?fileName=${filesNombres}`, { headers: headers });
  }

}
