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
import { CookieService } from 'ngx-cookie-service';
import { max, parse } from 'date-fns';



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
  allSol:any[]=[];
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

  metodoBusq!: number;

  changeview: string = 'consultar';

  currentPage: number = 1;


  constructor(private router: Router,
    private serviceGlobal: GlobalService,
    private tipoSolService: TipoSolService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private sectService: SectoresService,
    private nivRuteoService: NivelRuteoService,
    private cabCotService: CabCotizacionService,
    private cabOCService: CabOrdCompraService,
    private cabPagoService: CabPagoService,
    private cookieService: CookieService) { }

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

    this.chooseSearchMethod();
  }

  nextPage(): void {
    //console.log("nextPage",this.currentPage);
    if(  this.allSol.length <=10 ){
      //console.log("nextPage",this.currentPage," ",this.allSol.length/10,"",this.allSol);
      this.currentPage=1;
    }else if(this.currentPage >= this.allSol.length/10){
      this.currentPage=this.currentPage;
    }else{
      this.currentPage++
    }
    
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      //console.log("prevPage",this.currentPage);
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  consultarSol(): void {
    this.btp = this.bsqTipoSol;
    this.currentPage = 1;
    this.isConsulta = true;
    if (this.bsqTipoSol == 1) {
      this.getAllCotizaciones();
    } else if (this.bsqTipoSol == 2) {
      this.getAllOrdenCompras();
    } else if (this.bsqTipoSol == 3) {
      this.getAllOrdenPagos();
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
    } else if (this.bsqTipoSol == 3) {
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

  //evalua que solicitudes se deben mostrar segun los niveles de los roles de usuario
  chooseSearchMethod() {
    //obtiene el nivel maximo que posee el usuario para visualizar las solicitudes
    let listaRoles = this.cookieService.get('userRolNiveles').split(',').map(Number);
    var maxNivel = Math.max(...listaRoles);

    if (maxNivel == 10) {
      this.metodoBusq = 1;
    } else if (maxNivel >= 20 && maxNivel <= 40) {
      this.metodoBusq = 2;
    } else if (maxNivel >= 50 && maxNivel <= 70) {
      this.metodoBusq = 3;
    }
  }


  //CONSULTA TODAS LAS SOLICITUDES DEPENDIENDO DEL METODO DE BUSQUEDA DEL USUARIO
  getAllCotizaciones(): void {
    if (this.metodoBusq == 1) {
      this.cabCotService.getCotizacionesByIdNomina(this.cookieService.get('userNomina')).subscribe(
        response => {
          // console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.metodoBusq == 2) {
      this.cabCotService.getCotizacionesbyArea(parseInt(this.cookieService.get('userArea'))).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.metodoBusq == 3) {
      this.cabCotService.getAllCotizaciones().subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );
    }

  }

  getAllOrdenCompras(): void {
    if (this.metodoBusq == 1) {
       this.cabOCService.getOrdenCmpbyIdNomina(this.cookieService.get('userNomina')).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );
    } else if(this.metodoBusq == 2){
      this.cabOCService.getOrdenCmpbyArea(parseInt(this.cookieService.get('userArea'))).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );

    } else if(this.metodoBusq == 3){
       this.cabOCService.getAllOrdenCmp().subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
        },
        error => {
          console.log(error);
        }
      );
    }

  }


  getAllOrdenPagos(): void {
    if (this.metodoBusq == 1) {
      this.cabPagoService.getPagobyIdNomina(this.cookieService.get('userNomina')).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol=response;
        },
        error => {
          console.log(error);
        }
      );
    } else if(this.metodoBusq == 2){
      this.cabPagoService.getPagobyArea(parseInt(this.cookieService.get('userArea'))).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol=response;
        },
        error => {
          console.log(error);
        }
      );

    } else if(this.metodoBusq == 3){
      this.cabPagoService.getAllPago().subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol=response;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
