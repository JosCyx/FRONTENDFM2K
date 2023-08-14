import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CabeceraCotizacion } from 'src/app/models/procesos/solcotizacion/CabeceraCotizacion';
import { DetalleCotizacion } from 'src/app/models/procesos/solcotizacion/DetalleCotizacion';
import { ItemCotizacion } from 'src/app/models/procesos/solcotizacion/ItemCotizacion';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

interface SolicitudData {
  cabecera: any;
  detalles: any[];
  items: any[];
}

@Component({
  selector: 'app-allrequest',
  templateUrl: './allrequest.component.html',
  styleUrls: ['./allrequest.component.css']
})

export class AllrequestComponent implements OnInit {
  solicitudEdit!: SolicitudData;

  cabecera!: CabeceraCotizacion;
  detalle: DetalleCotizacion[] = [];
  item: ItemCotizacion[] = [];

  //listas para mostrar las solicitudes
  tipoSol$!: Observable<any[]>;
  allSol$!: Observable<any[]>;
  empleadoList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  trckList$!: Observable<any[]>;
  solicitud$!: Observable<any[]>;


  bsqTipoSol!: number;
  idBusq!: number;

  changeview: string = 'consultar';

  constructor(private router: Router, private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.tipoSol$ = this.service.getTipoSolicitud();
    this.empleadoList$ = this.service.getEmpleadosList();
    this.areaList$ = this.service.getAreaList();
    this.trckList$ = this.service.getNivelruteo();
  }

  consultarSol(): void {
    this.allSol$ = this.service.getCabbyTipoSol(this.bsqTipoSol);
  }

  async changeView(view: string) {
    this.changeview = view;
  }

  //guardar el valor del id en una variable y ejecuta los metodos para traer la solicitud y para guardar los datos en los objetos respectivos
  async selectSol(id: number) {
    this.idBusq = id;
    await this.getSolicitud();
    await this.saveData();
    await this.changeView('editar');
  }

  //realiza la llamada a la API para extraer la solicitud con el id seleccionado
  async getSolicitud() {
    try {
      const data = await this.service.getSolicitudbyId(this.idBusq).toPromise();
      this.solicitudEdit = data;
    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
    }
  }

  async saveData() {
    //guardar los datos de la lista solicitud edit en los objetos cabecera, detalle e item
    this.cabecera = this.solicitudEdit.cabecera;

    for (let det of this.solicitudEdit.detalles) {
      this.detalle.push(det as DetalleCotizacion);
    }

    for (let itm of this.solicitudEdit.items) {
      this.item.push(itm as ItemCotizacion);
    }

    console.log(this.cabecera);
    console.log(this.detalle);
    console.log(this.item);
  }

  cancelar(): void {
    this.clear();
    this.changeView('consultar');
  }

  clear(): void {
    this.solicitudEdit = { cabecera: {}, detalles: [], items: [] };
    this.cabecera = new CabeceraCotizacion(0);
    this.detalle = [];
    this.item = [];
  }

}
