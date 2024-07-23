import { HttpClient, HttpHeaders,HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

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

  getFilesDestino(tipoSol:number,noSol:number):Observable<any[]>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/Documento/GetDestinoFiles?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }

  viewFile(filesNombres:string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Documento/ViewFile?fileName=${filesNombres}`, {responseType:'blob'});
  }

  deleteFile(filesNombres:string):Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/Documento/DeleteFile?url=${filesNombres}`, { headers: headers });
  }

  deleteFolder(folderName: string){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/Documento/DeleteFolder?prefijo=${folderName}`, { headers: headers });
  }

  getSolManual(){
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Documento/GetSolicitudesManual`, {responseType:'blob'});
  }

  getInvManual(){
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Documento/GetInvManual`, {responseType:'blob'});
  }

  getComintManual(){
    const headers = this.getHeadersWithAuthToken();
    return this.http.get(`${this.APIUrl}/Documento/GetComintManual`, {responseType:'blob'});
  }

  DeleteDestino(id:number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/DestinoSolPagos/${id}`, { headers: headers });
  }

}
