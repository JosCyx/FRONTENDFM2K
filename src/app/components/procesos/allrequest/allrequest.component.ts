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
import { NivGerenciaService } from 'src/app/services/comunicationAPI/solicitudes/niv-gerencia.service';



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
  allSol: any[] = [];
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
    private cookieService: CookieService,
    private emplNivService: NivGerenciaService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getinfoNiveles();

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
    }, 200);
  }

  nextPage(): void {
    //console.log("nextPage",this.currentPage);
    if (this.allSol.length <= 10) {
      //console.log("nextPage",this.currentPage," ",this.allSol.length/10,"",this.allSol);
      this.currentPage = 1;
    } else if (this.currentPage >= this.allSol.length / 10) {
      this.currentPage = this.currentPage;
    } else {
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

  reorderCotizaciones(): void {
    //reordenar las solicitudes segun el campo cabSolCotNoSolicitud de mayor a menor
    this.allSol.sort((a, b) => b.cabSolCotNoSolicitud - a.cabSolCotNoSolicitud);
  }

  reorderOrdenCompra(): void {
    //reordenar las solicitudes segun el campo cabSolOCNoSolicitud de mayor a menor
    this.allSol.sort((a, b) => b.cabSolOCNoSolicitud - a.cabSolOCNoSolicitud);
  }

  reorderOrdenPago(): void {
    //reordenar las solicitudes segun el campo cabPagoNoSolicitud de mayor a menor
    this.allSol.sort((a, b) => b.cabPagoNoSolicitud - a.cabPagoNoSolicitud);
  }


  //CONSULTA TODAS LAS SOLICITUDES DEPENDIENDO DEL METODO DE BUSQUEDA DEL USUARIO
  getAllCotizaciones(): void {
    if (this.metodoBusq == 1) {
      this.cabCotService.getCotizacionesByIdNomina(this.cookieService.get('userIdNomina')).subscribe(
        response => {
          // console.log("Exito: ", response);
          this.allSol = response;
          this.reorderCotizaciones();
          this.saveEncargadoCotizacion();
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
          this.reorderCotizaciones();
          this.saveEncargadoCotizacion();
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
          this.reorderCotizaciones();
          this.saveEncargadoCotizacion();
        },
        error => {
          console.log(error);
        }
      );
    }

  }

  getAllOrdenCompras(): void {
    if (this.metodoBusq == 1) {
      this.cabOCService.getOrdenCmpbyIdNomina(this.cookieService.get('userIdNomina')).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenCompra();
          this.saveEncargadoOrdenCompra();
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.metodoBusq == 2) {
      this.cabOCService.getOrdenCmpbyArea(parseInt(this.cookieService.get('userArea'))).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenCompra();
          this.saveEncargadoOrdenCompra();

        },
        error => {
          console.log(error);
        }
      );

    } else if (this.metodoBusq == 3) {
      this.cabOCService.getAllOrdenCmp().subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenCompra();
          this.saveEncargadoOrdenCompra();
        },
        error => {
          console.log(error);
        }
      );
    }

  }


  getAllOrdenPagos(): void {
    if (this.metodoBusq == 1) {
      this.cabPagoService.getPagobyIdNomina(this.cookieService.get('userIdNomina')).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenPago();
          this.saveEncargadoPago();
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.metodoBusq == 2) {
      this.cabPagoService.getPagobyArea(parseInt(this.cookieService.get('userArea'))).subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenPago();
          this.saveEncargadoPago();
        },
        error => {
          console.log(error);
        }
      );

    } else if (this.metodoBusq == 3) {
      this.cabPagoService.getAllPago().subscribe(
        response => {
          //console.log("Exito: ", response);
          this.allSol = response;
          this.reorderOrdenPago();
          this.saveEncargadoPago();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  nivelEmpleados: any[] = [];
  nivProceso: any[] = [];

  async getinfoNiveles() {

    this.nivRuteoService.getNivelruteo().subscribe(
      response => {
        this.nivProceso = response;
      },
      error => {
        console.log(error);
      }
    );

    this.emplNivService.getNivGerencias().subscribe(
      response => {
        this.nivelEmpleados = response;
      },
      error => {
        console.log(error);
      }
    );


  }

  async saveEncargadoCotizacion() {
    for (const sol of this.allSol) {
      try {
        const encargado = await this.setEncargado(sol.cabSolCotEstadoTracking, sol.cabSolCotIdDept);
        sol.encargado = encargado; // Agrega la nueva propiedad "encargado" al elemento de allSol
      } catch (error) {
        console.error("Error al obtener el encargado para la solicitud:", error);
        // Puedes manejar el error como sea apropiado para tu aplicación
      }
    }
    //console.log("Lista allSol con encargados mapeados:", this.allSol);
  }

  async saveEncargadoOrdenCompra() {
    for (const sol of this.allSol) {
      try {
        const encargado = await this.setEncargado(sol.cabSolOCEstadoTracking, sol.cabSolOCIdDept);
        sol.encargado = encargado; // Agrega la nueva propiedad "encargado" al elemento de allSol
      } catch (error) {
        console.error("Error al obtener el encargado para la solicitud:", error);
        // Puedes manejar el error como sea apropiado para tu aplicación
      }
    }
    //console.log("Lista allSol con encargados mapeados:", this.allSol);
  }

  async saveEncargadoPago() {
    for (const sol of this.allSol) {
      try {
        const encargado = await this.setEncargado(sol.cabPagoEstadoTrack, sol.cabPagoIdDeptSolicitante);
        sol.encargado = encargado; // Agrega la nueva propiedad "encargado" al elemento de allSol
      } catch (error) {
        console.error("Error al obtener el encargado para la solicitud:", error);
        // Puedes manejar el error como sea apropiado para tu aplicación
      }
    }
    //console.log("Lista allSol con encargados mapeados:", this.allSol);
  }



  async setEncargado(nivel: number, dep: number) {
    if (nivel == 0) {
      return 'FINALIZADO'
    } else if (nivel == 9999) {
      return 'ANULADO'
    } else if (nivel == 10) {
      return this.cookieService.get('userName');
    } else {

      try {
        let nivelEmpleados: any[] = [];
        let nivProceso: string = '';
        let encargado: string = '';

        // Consulta el tipo de proceso del nivel
        const nivelInfoResponse = await this.nivRuteoService.getNivelInfo(nivel).toPromise();
        nivProceso = nivelInfoResponse[0].procesoRuteo;
        //console.log("nivProceso: ", nivProceso);

        // Consulta la lista de niveles por empleados
        try {
          const nivGerenciasResponse = await this.emplNivService.getNivGerencias().toPromise();
          //console.log("response: ", nivGerenciasResponse);
          nivelEmpleados = nivGerenciasResponse || [];

          nivProceso = nivProceso.trim();

          if (nivProceso === 'E') {
            const encargadoInfo = nivelEmpleados.find(x => x.empNivDeptAutorizado === dep && x.empNivRuteo === nivel);
            let dato = encargadoInfo.empNivEmpelado
            //console.log(dato);
            encargado = await this.searchEmpleadobyId(dato);
          } else if (nivProceso === 'G') {
            const encargadoInfo = nivelEmpleados.find(x => x.empNivDeptAutorizado === 0 && x.empNivRuteo === nivel);
            let dato = encargadoInfo.empNivEmpelado
            //console.log(dato);
            encargado = await this.searchEmpleadobyId(dato);
          }

          //console.log("encargado: ", encargado);
        } catch (error) {
          console.log(error);
        }
        return encargado;
      } catch (error) {
        console.log(error);
        return null; // Manejo de errores, puedes ajustarlo según tus necesidades
      }
    }
  }

  async searchEmpleadobyId(id: string): Promise<string> {
    try {
      const response = await this.empService.getEmpleadoByNomina(id).toPromise();

      if (response && response[0]) {
        const fullName = response[0].empleadoNombres + ' ' + response[0].empleadoApellidos;
        const namesArray = fullName.split(' '); // Divide el nombre completo en un array por espacios

        const firstName = namesArray[0] ? namesArray[0] : ''; // Obtiene el segundo elemento (índice 1) que sería el primer nombre
        const lastName = namesArray[2] ? namesArray[2] : ''; // Obtiene el cuarto elemento (índice 3) que sería el primer apellido

        const formattedName = firstName + (lastName ? ' ' + lastName : ''); // Concatena el primer nombre y primer apellido si existe

        return formattedName;
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  }






  /*async setEncargado(nivel: number, dep: number) {
    console.log("INICIO DEL METODO SETENCARGADO")
    let encargado: string = '';

    console.log("nivel: ", nivel);
    console.log("dep: ", dep);

    //buscar en la lista de nivProceso el elemento que coincida con nivel y extraer la propiedad nivProceso
    let nivelLet = this.nivProceso.find(x => x.nivel == nivel);
    //console.log("nivelLet: ", nivelLet);
    const nivelProceso = nivelLet.procesoRuteo;
    //console.log("nivelProceso: ", nivelProceso);
    //console.log(this.nivelEmpleados)
    if (nivelProceso == 'E') {
      //buscar en la lista de nivelEmpleados el elemento que coincida con el nivel y el departamento y extraer la propiedad empleadoNombre
      let empleado = this.nivelEmpleados.find(x => x.empNivRuteo == nivel && x.empNivDeptAutorizado == dep);
      console.log("empleado: ", empleado);
      encargado = await this.searchEmpleadobyId(empleado.empNivEmpelado);

    } else if (nivelProceso == 'G') {
      //buscar en la lista de nivelEmpleados el elemento que coincida con el nivel y el departamento y extraer la propiedad empleadoNombre
      let empleado = this.nivelEmpleados.find(x => x.nivel == nivel && x.dep == 0);
      console.log("empleado: ", empleado);
      encargado = await this.searchEmpleadobyId(empleado.empNivEmpelado);

    }
    console.log("encargado: ", encargado);

    this.allSol.map((item) => {
      if (item.cabSolCotId == this.serviceGlobal.solID) {
        item.cabSolCotEncargado = encargado;
      }
    });

  }

  async searchEmpleadobyId(id: string){
    let nombres = '';
    this.empService.getEmpleadoByNomina(id).subscribe(
      response => {
        //console.log("Exito: ", response);
        nombres = response[0].empleadoNombres + response[0].empleadoApellidos;
      },
      error => {
        console.log(error);
      }
    );
    console.log("nombres: ", nombres)
    return nombres;
  }*/

}
