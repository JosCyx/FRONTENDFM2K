import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CabeceraCotizacion } from 'src/app/models/procesos/solcotizacion/CabeceraCotizacion';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { GlobalService } from 'src/app/services/global.service';



@Component({
  selector: 'app-allrequest',
  templateUrl: './allrequest.component.html',
  styleUrls: ['./allrequest.component.css']
})

export class AllrequestComponent implements OnInit {
  
  cabecera!: CabeceraCotizacion;
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
  btp!: number;
  idBusq!: number;
  isSolicitud: boolean = true;
  isConsulta: boolean = false;

  changeview: string = 'consultar';

  constructor(private router: Router, private service: CommunicationApiService, private serviceGlobal: GlobalService) { }

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
    this.btp = this.bsqTipoSol;
    this.isConsulta = true;
    if(this.bsqTipoSol == 1){
      this.allSol$ = this.service.getAllCotizaciones();
    } else if (this.bsqTipoSol == 2){
      this.allSol$ = this.service.getAllOrdenCmp();
    } else if (this.bsqTipoSol == 3){
      this.allSol$ = this.service.getAllOrdenCmp();
    }

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
    
    this.serviceGlobal.solView = 'editar';
    this.serviceGlobal.solID = id;
    this.router.navigate(['solicoti']);
  }
  

  cancelar(): void {
    this.clear();
    this.changeView('consultar');
  }

  clear(): void {
    this.cabecera = new CabeceraCotizacion(0);
  }

  // clear(): void {
  //   this.solicitudEdit = { cabecera: {}, detalles: [], items: [] };
  //   this.cabecera = new CabeceraCotizacion(0);
  //   this.detalle = [];
  //   this.item = [];
  // }

}
