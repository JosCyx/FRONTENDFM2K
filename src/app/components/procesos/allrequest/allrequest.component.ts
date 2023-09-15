import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CabeceraCotizacion } from 'src/app/models/procesos/solcotizacion/CabeceraCotizacion';
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service'; 
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
import { GlobalService } from 'src/app/services/global.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';



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

  constructor(private router: Router,
    private serviceGlobal: GlobalService,
    private tipoSolService: TipoSolService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private sectService: SectoresService,
    private nivRuteoService: NivelRuteoService,
    private cabCotService: CabCotizacionService,
    private cabOCService: CabOrdCompraService,
    private cabPagoService: CabPagoService) { }

  ngOnInit(): void {
    this.tipoSol$ = this.tipoSolService.getTipoSolicitud();

    this.empleadoList$ = this.empService.getEmpleadosList();
    this.empleadoList$.subscribe((data) => {
      this.empleados = data;
    });

    this.areaList$ = this.areaService.getAreaList();
    this.areaList$.subscribe((data) => {
      this.areas = data;
    });

    this.sectores$ = this.sectService.getSectoresList();

    this.trckList$ = this.nivRuteoService.getNivelruteo();
  }

  consultarSol(): void {
    this.btp = this.bsqTipoSol;
    this.isConsulta = true;
    if (this.bsqTipoSol == 1) {
      this.allSol$ = this.cabCotService.getAllCotizaciones();
      this.allSol$.subscribe(
        response => {
          console.log("Exito")
        },
        error => {
          console.log("Error:",error)
        }
      );
    } else if (this.bsqTipoSol == 2) {
      this.allSol$ = this.cabOCService.getAllOrdenCmp();
      this.allSol$.subscribe(
        response => {
          console.log("Exito")
        },
        error => {
          console.log("Error:",error)
        }
      );
    } else if (this.bsqTipoSol == 3) {
      this.allSol$ = this.cabPagoService.getAllPago();
      this.allSol$.subscribe(
        response => {
          console.log("Exito")
        },
        error => {
          console.log("Error:",error)
        }
      );
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
    this.serviceGlobal.changePage = true;

    if (this.bsqTipoSol == 1) {
      this.router.navigate(['solicoti']);
    } else if (this.bsqTipoSol == 2) {
      this.router.navigate(['solioc']);
    }else if (this.bsqTipoSol == 3) {
      this.router.navigate(['solipago']);
    }

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
