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

  getSectoresList(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Sectors');
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
    return this.http.delete<any>(`${this.APIUrl}/RuteoAreas/${RutareaTipoSol},${RutareaArea},${RutareaNivel}`);
  }

  generateTracking(data: any) {
    return this.http.post(this.APIUrl + '/SolTrackings', data);
  }

  getLastSolicitud(tipoSol: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/SolTrackings/GetLastSol?tipoSol=${tipoSol}`);
  }

  getEmpleadobyArea(area: number) {
    return this.http.get<any[]>(`${this.APIUrl}/Empleadoes/GetEmpleadobyArea?area=${area}`);
  }
  //METODO  SOLICITUD DE COTIZACION
  addSolCot(data: any) {
    return this.http.post(this.APIUrl + '/CabSolCotizacions', data);
  }
  //METODO ORDEN COMPRA
  addSolOC(data: any) {
    return this.http.post(this.APIUrl + '/CabSolOrdenCompras', data);
  }
  //*METODO SOLICITUD DE PAGO
  addSolPag(data: any) {
    return this.http.post(this.APIUrl + '/CabSolPago', data);
  }

  getIDCabecera(tipoSol: number, noSol: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetCabecerabyID?tipoSol=${tipoSol}&noSol=${noSol}`);
  }

  //retorna todas las solicitudes de cotizacion
  getAllCotizaciones(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/CabSolCotizacions');
  }

  //retorna todas las solicitudes de orden de compra
  getAllOrdenCmp(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/CabSolOrdenCompras');
  }
  getOrdenOC(tipoSol: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/${tipoSol}`);
  }

  //retorna todas las solicitudes de pago
  getAllPago(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/MODIFICAR');
  }

  getLastDetalleCot(tipoSol: number, noSol: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/DetSolCotizacions/GetLastDetalleCot?tipoSol=${tipoSol}&noSol=${noSol}`);
  }

  /*getLastItem(idSol: number, idDet: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/ItemSectors/GetLastItem?idSol=${idSol}&idDet=${idDet}`);
  }*/

  //agregar un nuevo detalle a una nueva cabecera
  addDetalleCotizacion(data: any) {
    return this.http.post(this.APIUrl + '/DetSolCotizacions', data);
  }

  //agregar un nuevo item a un detalle
  addItemSector(data: any) {
    return this.http.post(this.APIUrl + '/ItemSectors', data);
  }

  getCotizacionbyId(id: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/CabSolCotizacions/GetSolicitudByID?ID=${id}`);
  }
  getOrdenComprabyId(id: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/CabSolOrdenCompras/GetSolicitudByID?ID=${id}`);
  }
  
  deleteItemSector(tipoSol: number, noSol: number, noDet: number, noItm: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/ItemSectors/${tipoSol}/${noSol}/${noDet}/${noItm}`);
  }
  
  //ACTUALIZAR CABECERAS DE COTIZACION Y ORDEN DE COMPRA
  updateOrdencompra( id:number,data:any){
    return this.http.put(this.APIUrl + `/CabSolOrdenCompras/${id}`,data);
  }

  updateCabCotizacion( id:number,data:any){
    return this.http.put(this.APIUrl + `/CabSolCotizacions/${id}`,data);
  }

  deleteAllItemBySol(tipoSol: number, noSol: number){
    return this.http.delete(`${this.APIUrl}/ItemSectors/DeleteAllItems?tipoSol=${tipoSol}&noSol=${noSol}`);
  }

  deleteAllDetBySol(tipoSol: number, noSol: number){
    return this.http.delete(`${this.APIUrl}/DetSolCotizacions/DeleteAllDetails?tipoSol=${tipoSol}&noSol=${noSol}`);
  }


  deleteDetallebyId(id:number){
    return this.http.delete(this.APIUrl + `/DetSolCotizacions/${id}`);
  }

  getItemsbyDet(tipoSol: number, noSol: number, noDet: number): Observable<any>{
    return this.http.get<any>(`${this.APIUrl}/ItemSectors/${tipoSol}/${noSol}/${noDet}`);
  }

  getLastItemID():Observable<any>{
    return this.http.get<any>(this.APIUrl + '/ItemSectors/GetLastItemID');
  }

  getLastDetalleID():Observable<any>{
    return this.http.get<any>(this.APIUrl + '/DetSolCotizacions/GetLastDetalleID');
  }
  //Procedimiento de GetDetalle_solicitud
  getDetalle_solicitud(tipoSol: number, noSol: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/DetSolCotizacions/GetDetalleSolicitud?tipoSol=${tipoSol}&noSol=${noSol}`);
  }

}
