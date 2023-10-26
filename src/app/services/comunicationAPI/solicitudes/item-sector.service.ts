import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';

@Injectable({
  providedIn: 'root'
})
export class ItemSectorService {

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

  //agregar un nuevo item a un detalle
  addItemSector(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/ItemSectors', data, { headers: headers });
  }

  deleteItemSector(tipoSol: number, noSol: number, noDet: number, noItm: number): Observable<any> {
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/ItemSectors/${tipoSol}/${noSol}/${noDet}/${noItm}`, { headers: headers });
  }

  deleteAllItemBySol(tipoSol: number, noSol: number){
    const headers = this.getHeadersWithAuthToken();
    return this.http.delete(`${this.APIUrl}/ItemSectors/DeleteAllItems?tipoSol=${tipoSol}&noSol=${noSol}`, { headers: headers });
  }

  getItemsbyDet(tipoSol: number, noSol: number, noDet: number): Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(`${this.APIUrl}/ItemSectors/${tipoSol}/${noSol}/${noDet}`, { headers: headers });
  }

  getLastItemID():Observable<any>{
    const headers = this.getHeadersWithAuthToken();
    return this.http.get<any>(this.APIUrl + '/ItemSectors/GetLastItemID', { headers: headers });
  }
}
