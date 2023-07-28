import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationApiService {

  //url de la api a donde se realizan las llamadas
  readonly APIUrl = "https://localhost:7086/api";

  constructor(private http: HttpClient) { }

  //METODOS CRUD PARA CADA ENTIDAD, SE HAN INCLUIDO UNICAMENTE LOS METODOS QUE SE ESTAN UTILIZANDO Y DE LOS CUALES SE HAYA CREADO UN CONTROLADOR

  //obtener toda la lista
  getRolsList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Rols');
  }

  //obtiene un rol dependiendo del codigo que se le pase como parametro
  getRolById(Rocodigo: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Rols/${Rocodigo}`);
  }

  //añadir elementos a la lista
  addRols(data: any) {
    return this.http.post(this.APIUrl + '/Rols', data);
  }

  //actualizar un elemento de la lista
  updateRols(Rocodigo: number | string, data: any) {
    return this.http.put(this.APIUrl + `/Rols/${Rocodigo}`, data);
  }

  //eliminar un elemento de la lista
  deleteRols(Rocodigo: number | string) {
    return this.http.delete(this.APIUrl + `/Rols/${Rocodigo}`);
  }

  addnivelRuteo(data: any) {
    return this.http.post(this.APIUrl + '/NivelesRuteos', data);
  }

  getNivelruteo(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/NivelesRuteos');
  }

  //devuelve los niveles que tengan como estado el valor indicado en el parametro
  getNivelbyEstado(estadoRuteo: string) {
    return this.http.get<any[]>(`${this.APIUrl}/NivelesRuteos/GetNivelByEstado?estadoRuteo=${estadoRuteo}`);
  }

  getTipoSolicitud(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/TipoSolics');
  }

  getDepartamentos(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Departamentoes');
  }

  getDptoById(dptoId: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Departamentoes/${dptoId}`);
  }

  //obtener lista de aplicaciones
  getAplicacionesList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Aplicaciones');
  }

  getRutList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Ruteos');
  }

  getEmpleadosList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Empleadoes');
  }

  updateEmpelado(empId: number | string, data: any) {
    return this.http.put(this.APIUrl + `/Empleadoes/${empId}`, data);
  }

  addEmpleados(data: any) {
    return this.http.post(this.APIUrl + '/Empleadoes', data);
  }

  getEmpleadoById(empleadoId: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Empleadoes/${empleadoId}`);
  }

  getAreaList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Areas');
  }

  getRuteos(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/RuteoAreas');
  }

  addRuteos(data: any) {
    return this.http.post(this.APIUrl + '/RuteoAreas', data);
  }

  checkRuteoExistence(rutTipoSol: number, rutArea: number, rutNivel: number): Observable<boolean> {
    const url = `${this.APIUrl}/RuteoAreas/checkRuteoExistence?rutTipoSol=${rutTipoSol}&rutArea=${rutArea}&rutNivel=${rutNivel}`;
    return this.http.get<boolean>(url);
  }

  getRuteosByArea(rutArea: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/RuteoAreas/${rutArea}`);
  }

  deleteRol(Rocodigo: number | string) {
    return this.http.delete(this.APIUrl + `/Rols/${Rocodigo}`);
  }

  //elimina un ruteo segun su area, tipo de solicitud y nivel
  deleteRuteo(RutareaTipoSol: number, RutareaArea: number, RutareaNivel: number): Observable<any> {
    const url = `${this.APIUrl}/RuteoAreas/${RutareaTipoSol},${RutareaArea},${RutareaNivel}`;
    return this.http.delete<any>(url);
  }
}
