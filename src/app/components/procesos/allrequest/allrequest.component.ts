import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
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
  
  empleados: any[] = [];
  areas: any[] = [];

  //listas para mostrar las solicitudes
  tipoSol$!: Observable<any[]>;
  allSol$!: Observable<any[]>;
  empleadoList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  sectores$!: Observable<any[]>;
  trckList$!: Observable<any[]>;
  solicitud$!: Observable<any[]>;


  bsqTipoSol: number = 0;
  idBusq!: number;
  isSolicitud: boolean = true;
  isConsulta: boolean = false;

  changeview: string = 'consultar';

  constructor(private router: Router, private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.tipoSol$ = this.service.getTipoSolicitud();

    this.empleadoList$ = this.service.getEmpleadosList();
    this.empleadoList$.subscribe((data) => {
      this.empleados = data;
    });

    this.areaList$ = this.service.getAreaList();
    this.areaList$.subscribe((data) => {
      this.areas = data;
    });

    this.sectores$ = this.service.getSectoresList();

    this.trckList$ = this.service.getNivelruteo();
  }

  consultarSol(): void {
    this.allSol$ = this.service.getCabbyTipoSol(this.bsqTipoSol);

    this.isConsulta = true;
  }

  async changeView(view: string) {
    this.changeview = view;
  }
  
  get estadoTexto(): string {
    switch (this.cabecera.cabSolCotEstado) {
      case 'A':
        return 'Activo';
      case 'F':
        return 'Finalizado';
      case 'C':
        return 'Cancelado';
      default:
        return ''; // Manejo por defecto si el valor no es A, F o C
    }
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

    //formatear la fecha de la solicitud para mostrar dia de semana y fecha
    this.cabecera.cabSolCotFecha = format(parseISO(this.cabecera.cabSolCotFecha),
      'eeee, d \'de\' MMMM \'de\' yyyy', { locale: es });
    this.cabecera.cabSolCotFecha = this.cabecera.cabSolCotFecha.charAt(0)
      .toUpperCase() + this.cabecera.cabSolCotFecha.slice(1);

    // Formatear la fecha máxima de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolCotFechaMaxentrega = format(parseISO(this.cabecera.cabSolCotFechaMaxentrega),
      'yyyy-MM-dd');

    // Formatear el plazo de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolCotPlazoEntrega = format(parseISO(this.cabecera.cabSolCotPlazoEntrega),
      'yyyy-MM-dd');

    //ordena los items de la lista segun el id del detalle de menor a mayor
    this.item.sort((a, b) => a.itmIdDetalle - b.itmIdDetalle);

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
