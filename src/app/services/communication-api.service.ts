import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationApiService {

  //url de la api a donde se realizan las llamadas
  readonly APIUrl = "https://localhost:7086/api";

  constructor(private http:HttpClient) { }
  
  //METODOS CRUD PARA CADA ENTIDAD, SE HAN ESCRITO UNICAMENTE LOS METODOS QUE SE ESTAN UTILIZANDO Y DE LOS CUALES SE HAYA CREADO UN CONTROLADOR

  //obtener toda la lista
  getRolsList():Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Rols');
  }

  //obtiene un rol dependiendo del codigo que se le pase como parametro
  getRolById(Rocodigo: number):Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Rols/${Rocodigo}`);
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

  obtenerTipoSolicitud():Observable<any[]> {
    return this.http.get<any>(this.APIUrl +'/TipoSolicituds');
  }

  obtenerDepartamento():Observable<any[]> {
    return this.http.get<any>(this.APIUrl +'/Departamentoes');
  }

  //obtener lista de aplicaciones
  getAplicacionesList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Aplicaciones');
  }

  getRutList():Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Ruteos');
  }

  addRuteos(data:any) {
    return this.http.post(this.APIUrl + '/Ruteos', data);
  }

  getEmpleadosList():Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Empleadoes');
  }

  
  updateEmpelado(empId:number|string, data:any) {
    return this.http.put(this.APIUrl + `/Empleadoes/${empId}`, data);
  }

  addEmpleados(data:any) {
    return this.http.post(this.APIUrl + '/Empleadoes', data);
  }
  
  getEmpleadoById(empleadoId:number):Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Empleadoes/${empleadoId}`);
  }
}
