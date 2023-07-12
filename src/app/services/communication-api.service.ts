import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationApiService {

  readonly APIUrl = "https://localhost:7086/api";

  constructor(private http:HttpClient) { }

  //metodos crud
  //obtener toda la lista
  getRolsList():Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Rols');
  }

  //añadir elementos a la lista
  addRols(data:any) {
    return this.http.post(this.APIUrl + '/Rols', data);
  }

  //actualizar un elemento de la lista
  updateRols(Rocodigo:number|string, data:any) {
    return this.http.put(this.APIUrl + `/Rols/${Rocodigo}`, data);
  }

  //eliminar un elemento de la lista
  deleteRols(Rocodigo:number|string) {
    return this.http.delete(this.APIUrl + `/Rols/${Rocodigo}`);
  }

  obtenerSolicitudes():Observable<any[]> {
    return this.http.get<any>(this.APIUrl +'/NivelesRuteos');
  }

  obtenerSolicitud():Observable<any[]> {
    return this.http.get<any>(this.APIUrl +'/TipoSolicituds');
  }

  obtenerDepartamento():Observable<any[]> {
    return this.http.get<any>(this.APIUrl +'/Departamentoes');
  }

  //obtener lista de aplicaciones
  getAplicacionesList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Aplicaciones');
  }
}
