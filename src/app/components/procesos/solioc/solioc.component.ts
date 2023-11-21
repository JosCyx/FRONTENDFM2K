import { Component, OnInit,Input, ViewChild, OnDestroy } from '@angular/core';

import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { TrackingService } from 'src/app/services/comunicationAPI/seguridad/tracking.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { DetCotOCService } from 'src/app/services/comunicationAPI/solicitudes/det-cot-oc.service';
import { ItemSectorService } from 'src/app/services/comunicationAPI/solicitudes/item-sector.service';
import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';

import { Observable, map } from 'rxjs';
import { Detalle } from 'src/app/models/procesos/Detalle';
import { ItemSector } from 'src/app/models/procesos/ItemSector';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { es, oc, tr } from 'date-fns/locale';
import { DetalleCotizacion } from 'src/app/models/procesos/solcotizacion/DetalleCotizacion';
import { ItemCotizacion } from 'src/app/models/procesos/solcotizacion/ItemCotizacion';
import { GlobalService } from 'src/app/services/global.service';
import { CabeceraOrdenCompra } from 'src/app/models/procesos/solcotizacion/CabeceraOrdenCompra';
import { CookieService } from 'ngx-cookie-service';
import { RuteoAreaService } from 'src/app/services/comunicationAPI/seguridad/ruteo-area.service';
import { OCDocumentacionComponent } from './oc-documentacion/oc-documentacion.component';
import { PresupuestoService } from 'src/app/services/comunicationAPI/solicitudes/presupuesto.service';
import { SendEmailService } from 'src/app/services/comunicationAPI/solicitudes/send-email.service';
import { NivGerenciaService } from 'src/app/services/comunicationAPI/solicitudes/niv-gerencia.service';
import { SharedService } from 'src/app/services/shared.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

interface RuteoArea {
  rutareaNivel: number;
  // Otras propiedades si es necesario
}

interface SolicitudData {
  cabecera: any;
  detalles: any[];
  items: any[];
}
@Component({
  selector: 'app-solioc',
  templateUrl: './solioc.component.html',
  styleUrls: ['./solioc.component.css'],
})
export class SoliocComponent implements OnInit, OnDestroy {
  empleado: string = '';
  inspector: string = '';
  showArea: string = '';
  areaNmco!: string;
  fecha: Date = new Date();
  private inputTimer: any;
  solNumerico!: string;
  noSolFormat!: string;
  proveedor!: string;
  buscarProveedor: string = '';
  tipobusqProv: string = 'nombre';

  //
  cabecera!: CabeceraOrdenCompra;
  detalle: DetalleCotizacion[] = [];
  item: ItemCotizacion[] = [];

  solicitudEdit!: SolicitudData;

  //variables para guardar el tracking
  trTipoSolicitud: number = 2; //indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10; //nivel de emision por defecto
  trIdNomEmp!: string;

  //variables de la cabecera
  cab_id_area!: number;
  cab_id_dept!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_asunto!: string;
  cab_proc!: string;
  cab_obsrv!: string;
  cab_adjCot: string = 'NO';
  cab_ncot: number = 0;
  cab_estado: string = 'A'; //estado inicial Activo
  cab_plazo!: Date;
  cab_fechaMax!: Date;
  cab_inspector!: string;
  cab_telef_insp!: string;
  cab_ruc_prov!: string;
  cab_proveedor!: string;

  //variables del detalle
  det_id: number = 1; //se usa para el detalle y para el item por sector
  det_descp!: string; //se usa para el detalle y para el item por sector
  det_unidad: string = 'Unidad';
  det_cantidad: number = 0;
  det_presupuesto: number = 0;

  //variables del item por sector
  item_id: number = 1;
  item_cant: number = 1;
  item_sector: number = 0;

  //variables para controlar la funcionalidad de la pagina
  fechaFormat: string = this.formatDateToSpanish(this.fecha);
  changeview: string = this.serviceGlobal.solView;
  msjExito!: string;
  msjError!: string;
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  checkDet: boolean = false;
  idToIndexMap: Map<number, number> = new Map();
  SolID: number = this.serviceGlobal.solID;
  fechaSinFormato: Date = new Date();
  detType: boolean = true;

  //listas con datos de la DB
  proveedorList$!: Observable<any[]>; //lista de proveedores
  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  inspectores$!: Observable<any[]>;
  detallesList$!: Observable<any[]>;
  itemxSector$!: Observable<any[]>;
  sectores$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;

  //listas locales para manejar los datos
  detalleList: Detalle[] = [];
  itemSectorList: ItemSector[] = [];
  tmpItemSect: ItemSector[] = [];
  empleados: any[] = [];
  proveedores: any[] = [];
  empleadoedit: any[] = [];
  areas: any[] = [];
  //sectores: any[] = [];
  inspectores: any[] = [];
  inspectoresEdit: any[] = [];
  presupuestos: any[] = [];

  //variable editar orden compra
  solID: number = this.serviceGlobal.solID;
  idDlt!: number;
  idNSolDlt!: number;
  idItmDlt!: number;
  //
  idDetEdit!: number;
  det_id_edit!: number;
  det_descp_edit!: string;
  //
  idDltDetList!: number;
  idDltDet!: number;
  // lastIDItem!: number;
  // lastIDDet!: number;
  //variables compartidas con los demas componentes
  @ViewChild(OCDocumentacionComponent) socDocumentacion!: OCDocumentacionComponent;
  @Input() sharedTipoSol: number = 2;
  @Input() sharedNoSol!: number;
  estadoSol: string = '10';

  areaUserCookie: string = '';

   //Variables para validacion de fecha 
   fechaminina: Date = new Date();
   fechamaxima: Date = new Date();
 
   fechaMin: string = '';
   fechaMax: string = '';
   fechaMinPlazo: string = '';

  constructor(
    private empService: EmpleadosService,
    private sectService: SectoresService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private solTrckService: TrackingService,
    private cabOCService: CabOrdCompraService,
    private detCotService: DetCotOCService,
    private itmSectService: ItemSectorService,
    private router: Router,
    private provService: ProveedorService,
    private serviceGlobal: GlobalService,
    private cookieService: CookieService,
    private ruteoService: RuteoAreaService,
    private prespService: PresupuestoService,
    private sendMailService: SendEmailService,
    private nivGerenciaService: NivGerenciaService,
    private sharedService: SharedService,
    private dialogService:DialogServiceService
  ) {
    /*//se suscribe al observable de aprobacion y ejecuta el metodo enviarSolicitud
    this.sharedService.aprobaroc$.subscribe(() => {
      //console.log("Aprobando solicitud...");
      this.enviarSolicitud();
    });

    //se suscribe al observable de anulacion y ejecuta el codigo para anular la solicitud
    this.sharedService.anularoc$.subscribe(() => {
      //console.log("Anulando solicitud...");
      this.anularSolicitud();
    });

    //se suscribe al observable de no autorizacion y ejecuta el codigo para no autorizar la solicitud
    this.sharedService.noautorizaroc$.subscribe(() => {
      //console.log("No autorizando solicitud...");
      this.noAutorizar();
    });*/
  }
  validarNumero(event: Event): void {
    const patron: RegExp=/^[0-9]+$/;
    const inputElement = event.target as HTMLInputElement;
    const valorIngresado = inputElement.value;
    if (!patron.test(valorIngresado)) {
      inputElement.value = inputElement.defaultValue; 
    }
  }

  ngOnInit(): void {
    this.fechaminina=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    this.fechamaxima=new Date(new Date().getFullYear(),new Date().getMonth()+6,new Date().getDate());
    this.fechaMax=this.formatDateToYYYYMMDD(this.fechamaxima);
    this.fechaMin=this.formatDateToYYYYMMDD(this.fechaminina);
    setTimeout(() => {
      
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadoedit = data;
      });
  
      this.inspectores$ = this.empService.getEmpleadosList(); //se le pasa el valor del id de nomina del area operaciones: 12
      this.inspectores$.subscribe((data) => {
        this.inspectoresEdit = data;
      });
      this.nivelRut$ = this.nivRuteService
        .getNivelruteo()
        .pipe(map((niv) => niv.sort((a, b) => a.nivel - b.nivel)));
      this.sectores$ = this.sectService
        .getSectoresList()
        .pipe(
          map((sectores) =>
            sectores.sort((a, b) => a.sectNombre.localeCompare(b.sectNombre))
          )
        );
  
      this.areaList$ = this.areaService.getAreaList();
  
      this.areaList$.subscribe((data) => {
        this.areas = data;
      });
  
      this.prespService.getPresupuestos().subscribe((data : any) => {
        this.presupuestos = data;
      });
    }, 100);
    this. areaUserCookie= this.cookieService.get('userArea');
    
    

    if (this.changeview == 'editar') {
      this.editSolicitud();
    }
  }


  ngOnDestroy(): void {
    //this.cancelar();
    //this.cancelarAll();
    //this.cancelarItem();
  }
  //Mensaje 
  callMensaje(mensaje: string, type: boolean){
    this.dialogService.openAlertDialog(mensaje, type);
  }
  Validacionfecha():void{
    const fechpl=this.cab_plazo;
    this.fechaMinPlazo=fechpl.toString();
  }
  showDoc: boolean = false;
  async setNoSolDocumentacion(){
    this.sharedNoSol = await this.getLastSol();
    this.showDoc = this.showDoc ? false : true;
  }

  //guarda los datos de los empleados en una lista local dependiendo del tamaño de la variable de busqueda, esto se controla con un keyup
  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empService.getEmpleadobyArea(parseInt(this.cookieService.get('userArea'))).subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }

  searchInspector(): void {
    if (this.inspector.length > 2) {
      this.inspectores$.subscribe((data) => {
        this.inspectores = data;
      });
    } else {
      this.inspectores = [];
    }
  }
 
  verificartexto(): void {
    const patron: RegExp = /^[a-zA-Z\s]*$/;
    if (!patron.test(this.inspector)) {
      //borrar el ultimo caracter ingresado
      console.log('El inspector no puede contener el número 1',this.inspector);
      // this.inspector = this.inspector.substring(0, this.inspector.length - 1);
      this.inspector = this.inspector.replace(/[^a-zA-Z\s]/g, '');
    } 
  }
  onInputChanged(): void {
    // Cancelamos el temporizador anterior antes de crear uno nuevo
    clearTimeout(this.inputTimer);

    // Creamos un nuevo temporizador que ejecutará el método después de 1 segundo
    this.inputTimer = setTimeout(() => {
      // Coloca aquí la lógica que deseas ejecutar después de que el usuario haya terminado de modificar el input
      if (this.inspector) {
        const empleadoSeleccionado = this.inspectores.find((emp) =>
             emp.empleadoNombres + ' ' + emp.empleadoApellidos ===
              this.inspector
        );
        if (this.changeview == 'crear') {
          this.cab_inspector = empleadoSeleccionado
            ? empleadoSeleccionado.empleadoIdNomina
            : "XXXXXX";
          //console.log('Inspector ID', this.cab_inspector);
        } else if (this.changeview == 'editar') {
          this.cabecera.cabSolOCInspector = empleadoSeleccionado
            ? empleadoSeleccionado.empleadoIdNomina
            : "XXXXXX";
          //console.log(Inspector id de Cabecera', this.cabecera.cabSolOCInspector);
        }
      } else {
        this.cab_inspector ="";
        this.cabecera.cabSolOCInspector = 0;
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  //guarda el nombre del area del empleado seleccionado
  selectEmpleado(): void {
    this.showArea = '';
    if (!this.empleado) {
      this.showArea = '';
    } else {
      for (let emp of this.empleados) {
        if (
          emp.empleadoNombres + ' ' + emp.empleadoApellidos ==
          this.empleado
        ) {
          this.trIdNomEmp = emp.empleadoIdNomina;
          this.cab_id_area = emp.empleadoIdArea;
          this.cab_id_dept = emp.empleadoIdDpto;
          this.depSolTmp = emp.empleadoIdDpto;
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              
              this.showArea = area.areaDecp;

              this.areaNmco = area.areaNemonico.trim();
              //console.log("Empleado area ID:",this.cab_area);
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.';
            }
          }
        }
      }
    }
  }
  /*//controla el contenido que se muestra en la pagina
  changeView(view: string): void {
    this.changeview = view;
  }*/

  //tranforma la fecha actual en un formato especifico "Lunes, 31 de julio de 2023"
  formatDateToSpanish(date: Date): string {
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  }

  //fomatea la fecha a yyyymmdd
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancelarAll(): void {
    this.clear();
    this.ngOnInit();
    this.sharedService.ocDocumentacionChange();
    //this.socDocumentacion.deleteAllDocs();
  }

  cancelarItem(): void {
    this.calcularCantDetalle();
    this.det_cantidad = 0;
    this.det_descp_edit = '';
    this.item_id = 1;
    this.tmpItemSect = [];
  }

  clear(): void {
    this.empleado = '';
    this.showArea = '';
    this.cab_asunto = '';
    this.det_descp = '';
    this.det_id = 1;
    this.cab_proc = '';
    this.cab_obsrv = '';
    this.cab_adjCot = '';
    this.cab_ncot = 0;
    this.cab_plazo = new Date();
    this.cab_fechaMax = new Date();
    this.inspector = '';
    this.cab_telef_insp = '';
    this.detalleList = [];
    this.itemSectorList = [];
    this.tmpItemSect = [];
    this.cab_ruc_prov = '';
    this.buscarProveedor = '';
    this.cab_proveedor = '';
  }

  getSolName(noSol: number) {
    const noSolString = noSol.toString();
    if (noSolString.length == 1) {
      this.solNumerico =
        'OC ' +
        this.areaNmco +
        ' ' +
        this.trTipoSolicitud +
        '-000' +
        noSolString;
    } else if (noSolString.length == 2) {
      this.solNumerico =
        'OC ' +
        this.areaNmco +
        ' ' +
        this.trTipoSolicitud +
        '-00' +
        noSolString;
    } else if (noSolString.length == 3) {
      this.solNumerico =
        'OC ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-0' + noSolString;
    } else if (noSolString.length == 4) {
      this.solNumerico =
        'OC ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-' + noSolString;
    }
  }

  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  getLastSol(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.solTrckService.getLastSolicitud(this.trTipoSolicitud).subscribe(
        (resultado) => {
          if (resultado === 0) {
            //console.log('No se ha registrado ninguna solicitud de este tipo.');
            resolve(1);
          } else {
            const lastNoSol = resultado[0].solTrNumSol + 1;
            //console.log('Último valor de solicitud:', lastNoSol);
            resolve(lastNoSol);
          }
        },
        (error) => {
          console.error(
            'Error al obtener el último valor de solicitud:',
            error
          );
          reject(error);
        }
      );
    });
  }

  guardarTrancking(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.trLastNoSol = await this.getLastSol();
        this.noSolTmp = this.trLastNoSol;

        const dataTRK = {
          solTrTipoSol: this.trTipoSolicitud,
          solTrNumSol: this.trLastNoSol,
          solTrNivel: this.trNivelEmision,
          solTrIdEmisor: this.trIdNomEmp,
        };

        //console.log('1. guardando tracking: ', dataTRK);
        this.solTrckService.generateTracking(dataTRK).subscribe(
          () => {
            //console.log('Tracking guardado con éxito.');
            resolve();
          },
          (error) => {
            console.log('Error al guardar el tracking: ', error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  //guarda la solicitud con estado emitido
  async generarSolicitud() {
    await this.guardarTrancking();
    this.getSolName(this.trLastNoSol);

    const dataCAB = {
      cabSolOCTipoSolicitud: this.trTipoSolicitud,
      cabSolOCIdArea: this.cab_id_area,
      cabSolOcIdDept: this.cab_id_dept,
      cabSolOCNoSolicitud: this.trLastNoSol,
      cabSolOCSolicitante: this.trIdNomEmp,
      cabSolOCFecha: this.cab_fecha,
      cabSolOCAsunto: this.cab_asunto,
      cabSolOCProcedimiento: this.cab_proc,
      cabSolOCObervaciones: this.cab_obsrv,
      cabSolOCAdjCot: this.cab_adjCot,
      cabSolOCNumCotizacion: this.cab_ncot,
      cabSolOCEstado: this.cab_estado,
      cabSolOCEstadoTracking: this.trNivelEmision,
      cabSolOCPlazoEntrega: this.cab_plazo,
      cabSolOCFechaMaxentrega: this.cab_fechaMax,
      cabSolOCInspector: this.cab_inspector,
      cabSolOCTelefInspector: this.cab_telef_insp,
      cabSolOCNumerico: this.solNumerico,
      cabSolOCProveedor: this.cab_proveedor,
      cabSolOCRUCProveedor: this.cab_ruc_prov,
      cabSolOCIdEmisor: this.cookieService.get('userIdNomina'),
      cabSolOCApprovedBy: 'XXXXXX',
      cabSolOCFinancieroBy: 'XXXXXX',
      cabSolOCAprobPresup: 'SI',
      cabSolOCMotivoDev: ''
    };

    //enviar datos de cabecera a la API
    //console.log('2. guardando solicitud...', dataCAB);
    await this.cabOCService.addSolOC(dataCAB).subscribe(
      (response) => {
        //console.log('Cabecera agregada.');
        //console.log('Solicitud', this.solNumerico);
        //console.log('Agregando cuerpo de la cabecera...');
        this.addBodySol();
        //console.log('Cuerpo agregado.');
      },
      (error) => {
        console.log('error al guardar la cabecera: ', error);
      }
    );
  }
  //permite crear el detalle y el item por sector y los envia a la API
  async addBodySol() {
    this.det_id = await this.getLastDetalleCot(); //numero del detalle que se va a guardar
    try {
      //enviar la lista detalle a la api para registrarla
      this.saveItemDet();
      this.getSolName(this.trLastNoSol);
      const msjExito ='Solicitud N°' + this.solNumerico + ' generada exitosamente.';
      this.callMensaje(msjExito,true);

      setTimeout(() => {
        this.clear();
        this.router.navigate(['allrequest']);
      }, 3000);
    } catch (error) {
      const msjError ='No se ha podido generar la solicitud, intente nuevamente.';
      this.callMensaje(msjError,false);
    }
  }
  //
  IdDetalle:number=0;
  CapturarIdDetalle(id:number):number{
    this.IdDetalle=id;
    //console.log("idDetalle",this.IdDetalle);
    return this.IdDetalle;
  }
  saveItemDet() {
    for (let detalle of this.detalleList) {
      //recorre la lista de detalles
      //crea el arreglo con las propiedades de detalle
      const data = {
        solCotTipoSol: this.trTipoSolicitud,
        solCotNoSol: this.trLastNoSol,
        solCotIdDetalle: detalle.det_id,
        solCotDescripcion: detalle.det_descp,
        solCotUnidad: detalle.det_unidad,
        solCotCantidadTotal: detalle.det_cantidad,
        solCotPresupuesto: detalle.det_presupuesto,
      };
      //envia a la api el arreglo data por medio del metodo post
      this.detCotService.addDetalleCotizacion(data).subscribe(
        (response) => {
          //console.log('3. Detalle añadido exitosamente.');
        },
        (error) => {
          console.log('No se ha podido registrar el detalle, error: ', error);
        }
      );
    }
    // console.log(this.detalleList);
    //enviar la lista itemsector a la api
    for (let item of this.itemSectorList) {
      const data = {
        itmTipoSol: this.trTipoSolicitud,
        itmNumSol: this.trLastNoSol,
        itmIdDetalle: item.det_id,
        itmIdItem: item.item_id,
        itmCantidad: item.item_cant,
        itmSector: item.item_sector,
      };

      this.itmSectService.addItemSector(data).subscribe(
        (response) => {
          //console.log('4. Item guardado exitosamente.');
        },
        (error) => {
          console.log(
            'No se pudo guardar el item no:' + item.item_id + ', error: ',
            error
          );
        }
      );
    }
    //console.log(this.itemSectorList);
  }
  /*getIdCabecera(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.service.getIDCabecera(this.trTipoSolicitud, this.trLastNoSol).subscribe(
        (resultado) => {
          if (resultado.length == 0) {
            console.log("No se ha encontrado ninguna cabecera");
          } else {
            const cabID = resultado[0].cabSolCotID;
            console.log('Id de la cabecera:', cabID);
            resolve(cabID);
          }
        },
        (error) => {
          console.error('Error al obtener el id de la cabecera:', error);
          reject(error);
        }
      );
    });
  }*/
  getLastDetalleCot(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.detCotService
        .getLastDetalleCot(this.trTipoSolicitud, this.trLastNoSol)
        .subscribe(
          (resultado) => {
            if (resultado === 0) {
              //console.log('No se ha registrado ningun detalle para esta solicitud. Se asigna 0.');
              resolve(1);
            } else {
              const lastDetCot = resultado[0].solCotID + 1;
              //console.log('Nuevo detalle: ', lastDetCot);
              resolve(lastDetCot);
            }
          },
          (error) => {
            console.error('Error al obtener el último id de detalle:', error);
            reject(error);
          }
        );
    });
  }
  check() {
    for (let idDet of this.itemSectorList) {
      for (let det of this.detalleList) {
        if (idDet.det_id == det.det_id) {
          //console.log("El detalle para este item si existe.");
          this.checkDet = true;
        } else {
          //console.log("Error, el detalle no se ha agregado");
          this.checkDet = false;
        }
      }
    }
    if (this.checkDet == true) {
      //console.log("Añadiendo detalle...");
      this.generarSolicitud();
    } else {
      this.showmsjerror = true;
      const msjError ='Error, asegúrese de ingresar todos los detalles antes de registrar la solicitud.';
      this.callMensaje(msjError,false);
    }
  }
  //agrega los detalles a la lista detalles
  addDetalle() {
    this.saveItemSect();
    const detalle = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      det_unidad: this.det_unidad,
      det_cantidad: this.det_cantidad,
      det_presupuesto: this.det_presupuesto
    };

    this.detalleList.push(detalle);
    this.incrementDetID();

    if (!this.detType) {
      this.item_id = 1;
    }
    //
    if (this.changeview == 'editar') {
      this.saveLocaltoResponse();
      //console.log('item a enviar a APi ');
    }

    this.det_descp = '';
    this.det_unidad = 'Unidad';
    this.det_cantidad = 0;
    this.det_presupuesto = 0;
    this.tmpItemSect = [];
  }

  incrementDetID() {
    //aumenta el valor del id de detalle

    if (this.detalleList.length == 0) {
      this.det_id = 1;
    } else {
      for (let det of this.detalleList) {
        this.det_id = det.det_id + 1;
      }
    }
  }

  async deleteDetalle(id: number) {
    const index = this.detalleList.findIndex(
      (detalle) => detalle.det_id === id
    );

    //console.log(index);
    if (index !== -1) {
      //console.log('detalle eliminado');
      this.detalleList.splice(index, 1);
      this.idToIndexMap.delete(index);
    }

    for (let i = 0; i < this.detalleList.length; i++) {
      this.detalleList[i].det_id = i + 1;
      this.idToIndexMap.set(this.detalleList[i].det_id, i);
    }
    this.incrementDetID();
  }

  //agregar los items a una lista temporal
  //se usa una lista temporal ya que hay que limpiarla cada vez que se vaya a agregar items que pertenezcan a un detalle nuevo
  addItemSector(): void {
    const tmpItemSector = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      item_id: this.item_id,
      item_cant: this.item_cant,
      item_sector: this.item_sector,
    };

    this.tmpItemSect.push(tmpItemSector);

    for (let itm of this.tmpItemSect) {
      this.item_id = itm.item_id + 1;
    }
    //this.det_cantidad += this.item_cant;
    this.calcularSumaItems();
    //aumenta el valor del id de los items
    this.item_cant = 1;
    this.item_sector = 0;
  }
  calcularSumaItems() {
    this.det_cantidad = 0;
    for (let itm of this.tmpItemSect) {
      if (itm.det_id === this.det_id) {
        this.det_cantidad += itm.item_cant;
      }
    }
  }

  //agregar los items de la lista temporal a la lista definitiva
  saveItemSect(): void {
    for (let tmpitm of this.tmpItemSect) {
      const itemSector = {
        det_id: tmpitm.det_id,
        det_descp: tmpitm.det_descp,
        item_id: tmpitm.item_id,
        item_cant: tmpitm.item_cant,
        item_sector: tmpitm.item_sector,
      };

      this.itemSectorList.push(itemSector);
    }
    this.item_id = 1;

    //console.log(this.itemSectorList);
  }
  //Icrementa el valor Item
  incrementItemID() {
    //aumemta eL valor de los ITEM
    if (this.tmpItemSect.length == 0) {
      this.item_id = 1;
    } else {
      for (let itm of this.tmpItemSect) {
        this.item_id = itm.item_id + 1;
      }
    }
  }
  //Eliminar  Item
  deleteItem(id: number) {
    const index = this.tmpItemSect.findIndex((item) => item.item_id === id);

    //console.log(index);
    if (index !== -1) {
      //console.log('item eliminado');
      this.tmpItemSect.splice(index, 1);
      this.idToIndexMap.delete(index);
    }
    this.calcularSumaItems();
    for (let i = 0; i < this.tmpItemSect.length; i++) {
      this.tmpItemSect[i].item_id = i + 1;
      this.idToIndexMap.set(this.tmpItemSect[i].item_id, i);
    }
    this.incrementItemID();

    //setTimeout(() => {}, 500);
  }
  //

  itemViewid!:number;
  itemDetalleView!:number;
  deleteview(id:number, detalle:number){
    this.itemViewid=id;//guarda el id del item que se va a eliminar
    this.itemDetalleView=detalle;//guarda el id del detalle al que pertenece el item que se va a eliminar
  }

  deleteViewSave(){
    console.log("listas",this.itemSectorList)
    const index = this.itemSectorList.findIndex(item=>item.item_id === this.itemViewid && item.det_id === this.itemDetalleView);
    if(index!==-1){
      //elimina el elemento que se ha seleccionado
      this.itemSectorList.splice(index,1);

      //reordena la lista para evitar problemas con el id
      this.reorderAndSaveItemView();

      //calcula la cantidad total de los items de todos los detalles
      this.calculardetalleview();

      //calcula el id del item a agregar (no se utiliza en esta parte)
      this.calcularIdItemView();
    }
  }

  async reorderAndSaveItemView(){
    const itemmap :{[key:number]:number} = {};

    for(const item of this.itemSectorList){
      const det = item.det_id;

      if(!itemmap[det]){
        itemmap[det] = 1;
      }

      item.item_id = itemmap[det];
      itemmap[det]++;

    }
  }

  calcularIdItemView(){
    for(let item of this.itemSectorList){
      if(item.det_id === this.det_id){
        this.item_id = item.item_id + 1;
      }
    }
  }


  calculardetalleview(){
    for(let det of this.detalleList){
      if(det.det_id === this.IdDetalle){
        det.det_cantidad = 0;
        for(let it of this.itemSectorList){
          
          if(it.det_id === this.IdDetalle){
            det.det_cantidad += it.item_cant;
          }

        }
      }

    }
  }
  //
  async editSolicitud() {
    this.clearSolGuardada();
    await this.getSolicitud();
    await this.saveData();
    //await this.changeView('editar');
  }
  //
  clearSolGuardada(): void {
    this.solicitudEdit = { cabecera: {}, detalles: [], items: [] };
    this.cabecera = new CabeceraOrdenCompra(0);
    this.detalle = [];
    this.item = [];
  }
  //editar solicitudes
  async getSolicitud() {
    try {
      this.getNivelRuteoArea();
      const data = await this.cabOCService
        .getOrdenComprabyId(this.SolID)
        .toPromise();
      this.solicitudEdit = data;
    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
    }
  }

  showEdicionItem: boolean = true;
  async saveData() {
    

    
    //guardar los datos de la lista solicitud edit en los objetos cabecera, detalle e item
    this.cabecera = this.solicitudEdit.cabecera;
    this.sharedTipoSol=this.cabecera.cabSolOCTipoSolicitud;
    this.sharedNoSol=this.cabecera.cabSolOCNoSolicitud;
    this.noSolTmp = this.cabecera.cabSolOCNoSolicitud;
    this.estadoTrkTmp = this.cabecera.cabSolOCEstadoTracking;
    this.depSolTmp = this.cabecera.cabSolOCIdDept;
    console.log(this.cabecera)

    this.checkAprobPrep(this.cabecera.cabSolOCEstadoTracking);

    if(this.cabecera.cabSolOCEstadoTracking > 10){
      this.showEdicionItem = false;
    }

    this.estadoSol = this.cabecera.cabSolOCEstadoTracking.toString();

    for (let det of this.solicitudEdit.detalles) {
      this.detalle.push(det as DetalleCotizacion);
      this.det_id = det.solCotIdDetalle + 2;
    }
    this.detalle.sort((a, b) => a.solCotIdDetalle - b.solCotIdDetalle);
    this.det_id = this.detalle.length + 1;

    for (let itm of this.solicitudEdit.items) {
      this.item.push(itm as ItemCotizacion);
    }
    this.item.sort((a, b) => {
      if (a.itmIdDetalle === b.itmIdDetalle) {
        return a.itmIdItem - b.itmIdItem; // Si los detalles son iguales, ordenar por ID de item
      }
      return a.itmIdDetalle - b.itmIdDetalle; // Ordenar por ID de detalle
    });
    this.fechaSinFormato = this.convertirStringAFecha(
      this.cabecera.cabSolOCFecha
    );
    //formatear la fecha de la solicitud para mostrar dia de semana y fecha
    this.cabecera.cabSolOCFecha = format(
      parseISO(this.cabecera.cabSolOCFecha),
      "eeee, d 'de' MMMM 'de' yyyy",
      { locale: es }
    );
    this.cabecera.cabSolOCFecha =
      this.cabecera.cabSolOCFecha.charAt(0).toUpperCase() +
      this.cabecera.cabSolOCFecha.slice(1);

    // Formatear la fecha máxima de entrega en formato 'yyyy-MM-dd' 
    this.cabecera.cabSolOCFechaMaxentrega = this.cabecera.cabSolOCFechaMaxentrega === "0001-01-01T00:00:00" ? '':format(parseISO(this.cabecera.cabSolOCFechaMaxentrega),'yyyy-MM-dd'
    );
    setTimeout(() => {
      for (let empl of this.inspectoresEdit) {
        if (empl.empleadoIdNomina == this.cabecera.cabSolOCInspector) {
          this.inspector = empl.empleadoNombres + ' ' + empl.empleadoApellidos;
        }
      }
      this.getNivelRuteoArea();
    }, 200);
    
    setTimeout(() => {
      for (let i = 0; i < this.nivelSolAsignado.length; i++) {
        const element = this.nivelSolAsignado[i];
        //guardar el ultimo elemento de la lista
        if (i === this.nivelSolAsignado.length - 1) {
          const nivel = element.rutareaNivel;
          this.lastNivel = nivel.toString();
        }
      }
    }, 500);

    // Formatear el plazo de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolOCPlazoEntrega = this.cabecera.cabSolOCPlazoEntrega === "0001-01-01T00:00:00" ? '':format(
      parseISO(this.cabecera.cabSolOCPlazoEntrega),
      'yyyy-MM-dd'
    );

    //ordena los items de la lista segun el id del detalle de menor a mayor
    this.item.sort((a, b) => a.itmIdDetalle - b.itmIdDetalle);

    this.setView();
  }

  lastNivel: string = '';

  get estadoTexto(): string {
    switch (this.cabecera.cabSolOCEstado) {
      case 'A':
        return 'Activo';
      case 'F':
        return 'Finalizado';
      case 'C':
        return 'Anulado';
      default:
        return ''; // Manejo por defecto si el valor no es A, F o C
    }
  }

  async changeView(view: string) {
    this.changeview = view;
    this.clear();
  }

  cancelar(): void {
    this.router.navigate(['allrequest']);
    this.clear();
    this.changeView('consultar');
  }

  confDeleteItm(idList: number, idItem: number, idNSol: number) {
    this.idDlt = idList;
    this.idItmDlt = idItem;
    this.idNSolDlt = idNSol;
    //console.log(this.idDlt, this.idItmDlt, this.idNSolDlt);
  }
  deleteItemSaved() {
    const index = this.item.findIndex((itm) => itm.itmID === this.idDlt);
    if (index !== -1) {
      this.item.splice(index, 1);
      // this.saveItemDB();
      this.reorderAndSaveItems();
      this.calcularCantDetalle();
      this.calcularIdItem();
    }
  }

  async reorderAndSaveItems() {
    const detailItemMap: { [key: number]: number } = {};

    for (const item of this.item) {
      const detalle = item.itmIdDetalle;

      if (!detailItemMap[detalle]) {
        detailItemMap[detalle] = 1;
      }

      item.itmIdItem = detailItemMap[detalle];
      detailItemMap[detalle]++;

      const data = {
        itmTipoSol: item.itmTipoSol,
        itmNumSol: item.itmNumSol,
        itmIdDetalle: item.itmIdDetalle,
        itmIdItem: item.itmIdItem,
        itmCantidad: item.itmCantidad,
        itmSector: item.itmSector,
      };

      this.itmSectService.addItemSector(data).subscribe(
        (response) => {
          //console.log('Item guardado exitosamente.');
        },
        (error) => {
          console.log('No se pudo guardar el item, error: ', error);
        }
      );
    }
  }
  //* convertir de tipo String a  new DATE
  convertirStringAFecha(fechaStr: string): Date {
    const fechaConvertida = new Date(fechaStr);
    return fechaConvertida;
  }
  //* Editar orden compra en el Enviar
  async saveEditCabecera() {
    const dataCAB = {
      cabSolOCID: this.cabecera.cabSolOCID,
      cabSolOCTipoSolicitud: this.cabecera.cabSolOCTipoSolicitud,
      cabSolOCIdArea: this.cabecera.cabSolOCIdArea,
      cabSolOcIdDept: this.cabecera.cabSolOCIdDept,
      cabSolOCNoSolicitud: this.cabecera.cabSolOCNoSolicitud,
      cabSolOCSolicitante: this.cabecera.cabSolOCSolicitante,
      cabSolOCFecha: this.fechaSinFormato,
      cabSolOCAsunto: this.cabecera.cabSolOCAsunto,
      cabSolOCProcedimiento: this.cabecera.cabSolOCProcedimiento,
      cabSolOCObervaciones: this.cabecera.cabSolOCObervaciones,
      cabSolOCAdjCot: this.cabecera.cabSolOCAdjCot,
      cabSolOCNumCotizacion: this.cabecera.cabSolOCNumCotizacion,
      cabSolOCEstado: this.cabecera.cabSolOCEstado,
      cabSolOCEstadoTracking: this.cabecera.cabSolOCEstadoTracking,
      cabSolOCPlazoEntrega: this.cabecera.cabSolOCPlazoEntrega,
      cabSolOCFechaMaxentrega: this.cabecera.cabSolOCFechaMaxentrega,
      cabSolOCInspector: this.cabecera.cabSolOCInspector,
      cabSolOCTelefInspector: this.cabecera.cabSolOCTelefInspector,
      cabSolOCNumerico: this.cabecera.cabSolOCNumerico,
      cabSolOCProveedor: this.cabecera.cabSolOCProveedor,
      cabSolOCRUCProveedor: this.cabecera.cabSolOCRUCProveedor,
      cabSolOCIdEmisor: this.cookieService.get('userIdNomina'),
      cabSolOCApprovedBy: this.aprobadopor,
      cabSolOCFinancieroBy: this.financieropor,
      cabSolOCAprobPresup: this.cabecera.cabSolOCAprobPresup,
      cabSolOCMotivoDev: this.cabecera.cabSolOCMotivoDev
    };
    //* Enviar datos para actualizar en tabla cab_sol_orden_compra
    //console.log('2. guardando solicitud...', dataCAB);
    this.cabOCService
      .updateOrdencompra(this.cabecera.cabSolOCID, dataCAB)
      .subscribe(
        (response) => {
          //console.log('Datos actualizados con éxito. ');
        },
        (error) => {
          console.log('error : ', error);
        }
      );
  }
  async saveEditDetalle() {
    //eliminar todos los detalles de la solicitud
    await this.deleteAllDetails();
    //guardar los nuevos detalles de la solicitud
    for (let detalle of this.detalle) {
      const data = {
        solCotTipoSol: this.cabecera.cabSolOCTipoSolicitud,
        solCotNoSol: this.cabecera.cabSolOCNoSolicitud,
        solCotIdDetalle: detalle.solCotIdDetalle,
        solCotDescripcion: detalle.solCotDescripcion,
        solCotUnidad: detalle.solCotUnidad,
        solCotCantidadTotal: detalle.solCotCantidadTotal,
        solCotPresupuesto: detalle.solCotPresupuesto
      };
      //console.log('Nuevo detalle: ', data);
      this.detCotService.addDetalleCotizacion(data).subscribe(
        (response) => {
          //console.log('Nuevo detalle', detalle.solCotIdDetalle,' guardado en la base');
        },
        (error) => {
          console.log('No se ha podido registrar el detalle, error: ', error);
        }
      );
    }
  }
  //
  deleteAllDetails(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.detCotService
          .deleteAllDetBySol(
            this.cabecera.cabSolOCTipoSolicitud,
            this.cabecera.cabSolOCNoSolicitud
          )
          .subscribe(
            (response) => {
              //console.log('Todos los detalles eliminados');
              resolve();
            },
            (error) => {
              console.log('Error: ', error);
              reject(error);
            }
          );
      } catch (error) {
        reject(error);
      }
    });
  }
  //
  async saveEditItem() {
    //eliminar todos los items de la solicitud
    await this.deleteAllItems();
    //guardar los nuevos items de la solicitud
    for (let item of this.item) {
      const data = {
        itmTipoSol: this.cabecera.cabSolOCTipoSolicitud,
        itmNumSol: this.cabecera.cabSolOCNoSolicitud,
        itmIdDetalle: item.itmIdDetalle,
        itmIdItem: item.itmIdItem,
        itmCantidad: item.itmCantidad,
        itmSector: item.itmSector,
      };
      //console.log('Nuevo item: ', data);

      this.itmSectService.addItemSector(data).subscribe(
        (response) => {
          //console.log(Nuevo item guardado en la base, item:',item.itmIdItem, , detalle:', item.itmIdDetalle);
        },
        (error) => {
          console.log(
            'No se pudo guardar el item no:' + item.itmIdItem + ', error: ',
            error
          );
        }
      );
    }
  }
  //
  deleteAllItems(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.itmSectService
          .deleteAllItemBySol(
            this.cabecera.cabSolOCTipoSolicitud,
            this.cabecera.cabSolOCNoSolicitud
          )
          .subscribe(
            (response) => {
              //console.log('Todos los items eliminados');
              resolve();
            },
            (error) => {
              console.log('Error: ', error);
              reject(error);
            }
          );
      } catch (error) {
        reject(error);
      }
    });
  }
  //
  clearList() {
    this.itemSectorList = [];
    this.detalleList = [];
  }
  setDetId() {
    const selectedDetalle = this.detalle.find(
      (det) => det.solCotDescripcion === this.det_descp
    );

    if (selectedDetalle) {
      this.det_id = selectedDetalle.solCotIdDetalle;
    }

    if (this.detType) {
      for (let itm of this.item) {
        if (itm.itmIdDetalle === this.det_id) {
          this.item_id = itm.itmIdItem + 1;
        }
      }
    } else {
      this.item_id = 1;
    }
  }
  //
  saveItemDetEdit() {
    for (let detalle of this.detalleList) {
      // Verificar si el detalle no existe en la lista actual de detalles
      const exists = this.detalle.some(
        (det) => det.solCotIdDetalle === detalle.det_id
      );

      if (exists) {
        //console.log('El detalle ya existe, no se ha guardado');
      } else {
        //console.log('Guardando detalle nuevo:', detalle.det_id);

        const data = {
          solCotTipoSol: this.cabecera.cabSolOCTipoSolicitud,
          solCotNoSol: this.cabecera.cabSolOCNoSolicitud,
          solCotIdDetalle: detalle.det_id,
          solCotDescripcion: detalle.det_descp,
          solCotUnidad: detalle.det_unidad,
          solCotCantidadTotal: detalle.det_cantidad,
          solCotPresupuesto: detalle.det_presupuesto
        };
        //console.log("Nuevo detalle: ",data);
        this.detCotService.addDetalleCotizacion(data).subscribe(
          (response) => {
            
          },
          (error) => {
            console.log('No se ha podido registrar el detalle, error: ', error);
          }
        );
      }
    }

    //console.log(this.detalleList);

    //enviar la lista itemsector a la api
    for (let item of this.itemSectorList) {
      const data = {
        itmTipoSol: this.cabecera.cabSolOCTipoSolicitud,
        itmNumSol: this.cabecera.cabSolOCNoSolicitud,
        itmIdDetalle: item.det_id,
        itmIdItem: item.item_id,
        itmCantidad: item.item_cant,
        itmSector: item.item_sector,
      };
      //console.log("Nuevo item: ",data);
      this.itmSectService.addItemSector(data).subscribe(
        (response) => {
          
        },
        (error) => {
          console.log(
            'No se pudo guardar el item no:' + item.item_id + ', error: ',
            error
          );
        }
      );
    }
  }

  //Guardar a la tabla
  saveLocaltoResponse() {
    for (let itm of this.itemSectorList) {
      const data = {
        itmID: 0, //modificar
        itmTipoSol: this.cabecera.cabSolOCTipoSolicitud,
        itmNumSol: this.cabecera.cabSolOCNoSolicitud,
        itmIdDetalle: itm.det_id,
        itmIdItem: itm.item_id,
        itmCantidad: itm.item_cant,
        itmSector: itm.item_sector,
      };
      this.item.push(data);
    }
    this.itemSectorList = [];
    for (let det of this.detalleList) {
      const data = {
        solCotID: 0,
        solCotTipoSol: this.cabecera.cabSolOCTipoSolicitud,
        solCotNoSol: this.cabecera.cabSolOCNoSolicitud,
        solCotIdDetalle: det.det_id,
        solCotDescripcion: det.det_descp,
        solCotUnidad: det.det_unidad,
        solCotCantidadTotal: det.det_cantidad,
        solCotPresupuesto: det.det_presupuesto
      };

      this.detalle.push(data);
    }
    this.detalleList = [];
  }
  addNewItem() {
    const data = {
      itmID: 0, //obtener el ultimo id de los items y sumar +1
      itmTipoSol: this.cabecera.cabSolOCTipoSolicitud,
      itmNumSol: this.cabecera.cabSolOCNoSolicitud,
      itmIdDetalle: this.idDetEdit,
      itmIdItem: this.item_id,
      itmCantidad: this.item_cant,
      itmSector: this.item_sector,
    };

    this.item.push(data);
    //console.log(this.item);
    this.calcularIdItem();
    this.calcularCantDetalle();
    this.item_cant = 1;
    this.item_sector = 0;
  }
  //Al momento de seleccionar
  selectDet(det: DetalleCotizacion) {
    this.idDetEdit = det.solCotIdDetalle;
    this.det_descp_edit = det.solCotDescripcion;
    this.det_id_edit = det.solCotIdDetalle;
    this.calcularIdItem();
  }
  //*
  calcularCantDetalle() {
    for (let det of this.detalle) {
      if (det.solCotIdDetalle === this.idDetEdit) {
        det.solCotCantidadTotal = 0; // Reiniciar la cantidad total del detalle
        for (let itm of this.item) {
          if (itm.itmIdDetalle === det.solCotIdDetalle) {
            det.solCotCantidadTotal += itm.itmCantidad;
          }
        }
      }
    }
    //this.det_cantidad += this.item_cant;
  }
  calcularIdItem() {
    for (let itm of this.item) {
      if (itm.itmIdDetalle === this.idDetEdit) {
        this.item_id = itm.itmIdItem + 1;
      }
    }
  }
  confDeleteDet(idListDet: number, idDetalle: number) {
    this.idDltDetList = idListDet;
    this.idDltDet = idDetalle;
  }
  deleteDetSaved() {
    //elimina el item de la lista local y llama al metodo que ejecuta los cambios en la base
    const index = this.detalle.findIndex(
      (det) => det.solCotID === this.idDltDetList
    );
    //console.log('Detalle a eliminar numero ', index);

    if (index !== -1) {
      this.detalle.splice(index, 1);
      this.det_id--;
      /*this.reorderAndSaveItems();
      this.calcularCantDetalle();
      this.calcularIdItem();*/

      //ELIMINAR ITEMS QUE PERTENECEN AL DETALLE ELIMINADO
      for (let i = this.item.length - 1; i >= 0; i--) {
        if (this.item[i].itmIdDetalle === this.idDltDet) {
          this.item.splice(i, 1);
        }
      }

      //ACTUALIZAR EL ID DEL DETALLE DE LOS SIGUIENTES ITEMS
      for (let i = 0; i < this.item.length; i++) {
        if (this.item[i].itmIdDetalle > this.idDltDet) {
          this.item[i].itmIdDetalle = this.item[i].itmIdDetalle - 1;
        }
      }
      //ACTUALIZAR EL ID DE LOS DETALLE
      for (let d = 0; d < this.detalle.length; d++) {
        if (this.detalle[d].solCotIdDetalle > this.idDltDet) {
          this.detalle[d].solCotIdDetalle = this.detalle[d].solCotIdDetalle - 1;
        }
      }
    }
    //console.log(this.item);
  }
  openModalItem() {
    this.item_id = 1;
  }
  async saveEdit() {
    try {
      await this.saveEditCabecera();
      await this.saveEditDetalle();
      await this.saveEditItem();
      const msjExito ='Solicitud N°' +this.cabecera.cabSolOCNumerico +' editada exitosamente.';
      this.callMensaje(msjExito,true);
      setTimeout(() => {
        this.router.navigate(['allrequest']);
        this.clear();
      }, 3000);
    } catch (error) {
      const msjError ='No se ha podido guardar la solicitud, intente nuevamente.';
      this.callMensaje(msjError,false)
    }
  }
  //Buscar Proveedor y guardar
  searchProveedor(datos: string): void {
    if (datos.length > 2) {
      //console.log('Buscar Proveedor: ', datos);
      this.provService.getProveedorByNombre(datos).subscribe(
        (data) => {
          this.proveedores = data;
          //console.log('Proveedor ', this.proveedores);
          if (this.proveedores.length > 0) {
            if (this.changeview == 'crear') {
              this.cab_proveedor = this.proveedores[0].prov_nombre;
              this.cab_ruc_prov = this.proveedores[0].prov_ruc;
            } else if (this.changeview == 'editar') {
              this.cabecera.cabSolOCProveedor = this.proveedores[0].prov_nombre;
              this.cabecera.cabSolOCRUCProveedor = this.proveedores[0].prov_ruc;
            }
          }
        },
        (error) => {
          console.error('error en buscar proveedor: ', error);
        }
      );
    }
  }
  //Limpiar los campos al momento de cambiar el tipo de busqueda
  limpiarCampos(): void {
    this.cab_ruc_prov = '';
    this.buscarProveedor = '';
    this.cab_proveedor = '';
    this.cabecera.cabSolOCProveedor = '';
    this.cabecera.cabSolOCRUCProveedor = '';
  }
  // metodo para buscar proveedor por RUC
  searchProveedorRuc(datos: string): void {
    try {
      //console.log('Buscar Proveedor por RUC: ', datos);
      this.provService.getProveedorByRUC(datos).subscribe({
        next: (data) => {
          //console.log('mis datos ', data);
          if (data) {
            if (this.changeview == 'crear') {
              this.cab_proveedor = data[0].prov_nombre;
              this.cab_ruc_prov = data[0].prov_ruc;
              //console.log('Proveedor ', this.cab_proveedor);
              //console.log('RUC ', this.cab_ruc_prov);
            } else if (this.changeview == 'editar') {
              this.cabecera.cabSolOCProveedor = data[0].prov_nombre;
              this.cabecera.cabSolOCRUCProveedor = data[0].prov_ruc;
              
            }
          }
        },
        error: (error) => {
          console.error('Error al Obtener el RUC del Proveedor:', error);
        },
        complete: () => console.info('completado'),
      });
    } catch (error) {
      console.error('Error al Obtener el RUC del Proveedor:', error);
    }
  }
  //* Actiones
  actionEdit:string='edicion';
  selectEditAction(action:string){
    this.actionEdit=action;
  }

  actionCreate: string = 'creacion';

  selectCreateAction(action: string) {
    this.actionCreate = action;
  }

    ////////////////////////////////////////////CONTROL DE VISUALIZACION SEGUN ESTADO//////////////////////////////////////////
    viewElement: boolean = false;

    setView() { 
      const userNivelesCookie = this.cookieService.get('userRolNiveles');
      const userNivelesArray = userNivelesCookie.split(',').map(Number);
      if(userNivelesArray.includes(this.cabecera.cabSolOCEstadoTracking)){
        this.viewElement = true;
      } else {
        this.viewElement = false;
      }
      //console.log('viewElement: ', this.viewElement);
    }


    ////////////////////////////////////////////ENVIO DE SOLICITUD DE COTIZACION//////////////////////////////////////////

    guardarEnviarSolNueva() {
      try {
        this.check();
        setTimeout(() => {
          this.enviarSolicitud();
        }, 500);
      } catch (error) {
        console.log('Error:', error);
        const msjError = "No se ha podido enviar la solicitud, intente nuevamente.";
        this.callMensaje(msjError,false);
      }
    }
  
    guardarEnviarSolEditada() {
      try {
        this.saveEdit();
        setTimeout(() => {
          this.enviarSolicitud();
        }, 500);     
      } catch (error) {
        console.log('Error:', error);
        const msjError = "No se ha podido enviar la solicitud, intente nuevamente.";
        this.callMensaje(msjError,false);  
      }
    }

  noSolTmp: number = 0;//asegurarse que el numero de solicitud actual de la cabecera este llegando aqui
  estadoTrkTmp: number = 10;//asegurarse que el estado actual de la cabecera este llegando aqui
  depSolTmp: number = 0;//asegurarse que el area actual de la cabecera este llegando aqui


  aprobadopor: string = 'XXXXXX';
  financieropor: string = 'XXXXXX';
  // Método que cambia el estado del tracking de la solicitud ingresada como parámetro al siguiente nivel
  async enviarSolicitud() {
    //verifica los niveles de aprobacion y financiero para asignar el usuario que envia la solicitud para guardar el empleado quien autoriza
    if (this.estadoTrkTmp == 40) {
      this.aprobadopor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setAprobadoPor(this.aprobadopor);
    } else if (this.estadoTrkTmp == 60) {
      this.financieropor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setFinancieroPor(this.financieropor);
    } 

    await this.getNivelRuteoArea();
    try {
      // Espera a que se complete getNivelRuteoArea
      let newEstado: number = 0;
      let newestadoSt: string;
      let lastNivel: number = 0;

      for (let i = 0; i < this.nivelSolAsignado.length; i++) {
        const element = this.nivelSolAsignado[i];

        //guardar el ultimo elemento de la lista
        if (i === this.nivelSolAsignado.length - 1) {
          lastNivel = element.rutareaNivel;
        }
      }

      if (this.estadoTrkTmp == lastNivel) {
        //console.log("FINALIZADO");
        try {
          //console.log("Valores de actualizacion de estado:", this.trTipoSolicitud, this.noSolTmp, newEstado);
          this.cabOCService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'F').subscribe(
            (response) => {
              this.cabOCService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 0).subscribe(
                (response) => {

                  const msjExito = 'La solicitud ha sido enviada exitosamente.';
                  this.callMensaje(msjExito,true);
                  setTimeout(() => {
                    this.clear();
                    this.serviceGlobal.solView = 'crear';
                    this.router.navigate(['allrequest']);
                  }, 3000);
                },
                (error) => {
                  console.log('Error al actualizar el estado: ', error);
                }
              );
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
            }
          );


        } catch (error) {
          console.error('Error al setear el estado como finalizado: ', error);
        }

      } else {
        for (let i = 0; i < this.nivelSolAsignado.length; i++) {
          var nivel = this.nivelSolAsignado[i];
          if (nivel.rutareaNivel == this.estadoTrkTmp) {
            newEstado = this.nivelSolAsignado[i + 1].rutareaNivel;
            //extrae el tipo de proceso del nivel actual
            this.nivRuteService.getNivelInfo(newEstado).subscribe(
              (response) => {
                newestadoSt = response[0].procesoRuteo;
                //console.log("tipo de proceso de nivel: ", newestadoSt);
              },
              (error) => {
                console.log('Error al obtener el nuevo estado de tracking: ', error);
              }
            )
           
            break;
          }

        }
        //hace la peticion a la API para cambiar el estado de la solicitud
        //console.log("Valores de actualizacion de estado:", this.trTipoSolicitud, this.noSolTmp, newEstado);
        setTimeout(() => {
          this.cabOCService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
            (response) => {
              //console.log("Solicitud enviada");
              const msjExito = `La solicitud ha sido enviada exitosamente.`;
              this.callMensaje(msjExito,true)
              //LLAMA AL METODO DE ENVIAR CORREO Y LE ENVIA EL SIGUIENTE NIVEL DE RUTEO
              this.sendNotify(newEstado, newestadoSt, 1);

              setTimeout(() => {
                this.clear();
                this.serviceGlobal.solView = 'crear';
                this.router.navigate(['allrequest']);
              }, 3000);
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
            }
          );
        }, 500);

      }

    } catch (error) {
      console.error('Error al obtener los niveles de ruteo asignados: ', error);
    }
  }

  // Método que consulta los niveles que tiene asignado el tipo de solicitud según el área
  nivelSolAsignado: RuteoArea[] = [];
  nivelRuteotoAut: RuteoArea[] = [];
  nivelesRuteo: any[] = [];
  async getNivelRuteoArea() {
    this.nivelRut$.subscribe((response) => { this.nivelesRuteo = response; });
    try {
      const response = await this.ruteoService.getRuteosByArea(this.depSolTmp).toPromise();
      this.nivelSolAsignado = response.filter((res: any) => res.rutareaTipoSol == this.trTipoSolicitud);
      this.nivelSolAsignado.sort((a, b) => a.rutareaNivel - b.rutareaNivel);
      this.nivelRuteotoAut = this.nivelSolAsignado;
      //console.log('Niveles de ruteo asignados: ', this.nivelSolAsignado);
    } catch (error) {
      throw error;
    }
  }

  metodo(){
    this.ruteoService.getRuteosByArea(this.depSolTmp).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }



   ///////////////////////////////////////////ANULACION DE SOLICITUD///////////////////////////////////////////////////

   anularSolicitud() {
    let exito: boolean = false;
    let exitotrk: boolean = false;

    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabSolOCIdEmisor).subscribe(
      (response: any) => {
        //console.log('Empleado: ', response);
        mailToNotify = response[0].empleadoCorreo;
        //console.log("Correo enviado a: ", mailToNotify)
      },
      (error) => {
        console.log('Error al obtener el empleado: ', error);
      }
    );

    try {
      this.cabOCService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'C').subscribe(
        (response) => {
          //console.log('Estado actualizado exitosamente');
          exito = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exito = false;
        }
      );

      this.cabOCService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 9999).subscribe(
        (response) => {
          //console.log('Estado de tracknig actualizado exitosamente');
          exitotrk = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exitotrk = false;
        }
      );
      setTimeout(() => {

        if (exito && exitotrk) {
          this.showmsj = true;
          const msjExito = `La solicitud N° ${this.cabecera.cabSolOCNumerico} ha sido anulada exitosamente.`;
          this.callMensaje(msjExito,true);

          //notificar al emisor de la solicitud que ha sido anulada
          this.sendMail(mailToNotify,2);

          setTimeout(() => {
            this.clear();
            this.serviceGlobal.solView = 'crear';
            this.router.navigate(['allrequest']);
          }, 3000);
        }
      }, 500);

    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      const msjError = "No se ha podido anular la solicitud, intente nuevamente.";
      this.callMensaje(msjError,false);
    }

  }
  ///////////////////////////////////////////NO AUTORIZAR SOLICITUD///////////////////////////////////////////////////

  async noAutorizar(){
    await this.getNivelRuteoArea();
    //console.log("Niveles de ruteo asignados: ", this.nivelRuteotoAut);
    
    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabSolOCIdEmisor).subscribe(
      (response: any) => {
        //console.log('Empleado: ', response);
        mailToNotify = response[0].empleadoCorreo;
        //console.log("Correo enviado a: ", mailToNotify)
      },
      (error) => {
        console.log('Error al obtener el empleado: ', error);
      }
    );

    for(let i = 0; i < this.nivelRuteotoAut.length; i++){
      let niv = this.nivelRuteotoAut[i];
      if(niv.rutareaNivel == this.estadoTrkTmp){
        let newEstado = this.nivelRuteotoAut[i-1].rutareaNivel;
        let newestadoSt = '';
        
        //extrae el tipo de proceso del nivel actual
        this.nivRuteService.getNivelInfo(newEstado).subscribe(
          (response) => {
            newestadoSt = response[0].procesoRuteo;
            //console.log("tipo de proceso de nivel: ", newestadoSt);
          },
          (error) => {
            console.log('Error al obtener el nuevo estado de tracking: ', error);
          }
        );
        
        this.cabOCService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
          (response) => {
            //console.log('Estado de tracknig actualizado exitosamente');
            const msjExito = `La solicitud N° ${this.cabecera.cabSolOCNumerico} ha sido devuelta al nivel anterior.`;
            this.callMensaje(msjExito,true)

            if(newEstado == 10){
              //notificar al emisor
              this.sendMail(mailToNotify,3);

            } else {
              //notificar al nivel correspondiente
              this.sendNotify(newEstado, newestadoSt, 3); 
            }

            setTimeout(() => {
              this.clear();
              this.serviceGlobal.solView = 'crear';
              this.router.navigate(['allrequest']);
            }, 3000);
          },
          (error) => {
            console.log('Error al actualizar el estado: ', error);
            this.showmsjerror = true;
            const msjError = "No se ha podido devolver la solicitud, intente nuevamente.";
            this.callMensaje(msjError,false)
          }
        );
        
        //console.log("Nuevo estado: ", newEstado);
        break;
      }

    }
  }

  ////////////////////////////////////NOTIFICACION AL SIGUIENTE NIVEL//////////////////////////////////////////////////


  async sendNotify(nivelStr: number, nivelStatus: string, tipoNotificacion: number) {
    //nivelStr: numero del nivel de ruteo al que se le va a enviar la notificacion
    //nivelStatus: tipo de proceso del nivel de ruteo al que se le va a enviar la notificacion
    //tipoNotificacion: tipo de notificacion que se va a enviar (1: solicitud nueva, 2: solicitud anulada, 3: solicitud devuelta)
    //console.log("Nivel de ruteo: ", nivelStr);

    let mailToNotify = '';
    let depToSearch = 0;

    if (nivelStatus == 'E') {
      depToSearch = this.depSolTmp;
    } else if (nivelStatus == 'G') {
      depToSearch = 0;
    }

    setTimeout(() => {
      this.nivGerenciaService.getNivGerenciasByDep(depToSearch, nivelStr).subscribe(
        (response) => {
          //console.log('Niveles de gerencia para este nivel: ', response);
          for (let emp of response) {
            if (emp.empNivImp == 'T') {
              //buscar el correo del empleado y setear su correo en la variable maltonotify
              this.empService.getEmpleadoByNomina(emp.empNivEmpelado).subscribe(
                (response: any) => {
                  //console.log('Empleado: ', response);
                  mailToNotify = response[0].empleadoCorreo;
                  //enviar la notificacion al correo guardado en mailnotify
                  this.sendMail(mailToNotify,tipoNotificacion);
                  //console.log("Correo enviado a: ", mailToNotify)
                },
                (error) => {
                  console.log('Error al obtener el empleado: ', error);
                }
              );
            }
          }
        },
        (error) => {
          console.log('Error al obtener los niveles de gerencia: ', error);
        }
      );
    }, 100);
  }

  asunto: string = 'Nueva Solicitud de Orden de Compra Recibida - Acción Requerida';
  emailContent: string = `Estimado(a),<br>Hemos recibido una nueva Solicitud de Orden de Compra.<br>Para continuar con el proceso, le solicitamos que revise y apruebe esta solicitud para que pueda avanzar al siguiente nivel de ruteo.<br>Esto garantizará una gestión eficiente y oportuna en el Proceso de Compras.<br>Por favor ingrese a la app <a href="http://192.168.1.71/solicitudesfm2k/">SOLICITUDES</a> para acceder a la solicitud.`;

  asuntoDevuelto: string = 'Notificación - Solicitud de Orden de Compra Devuelta';
  emailContent1: string = `Estimado(a), le notificamos que la solicitud de orden de compra autorizada por usted ha sido devuelta, por favor ingrese a la aplicación <a href="http://192.168.1.71/solicitudesfm2k/">SOLICITUDES</a> para acceder a la solicitud y realizar las correcciones necesarias.`;

  asuntoAnulado: string = 'Notificación - Solicitud de Orden de Compra Anulada';
  emailContent2: string = `Estimado(a), le notificamos que la solicitud de orden de compra generada por usted ha sido anulada, si desea conocer más detalles pónganse en contacto con el responsable de la anulación.`;

  sendMail(mailToNotify: string, type: number) {
    let contenidoMail = '';
    let asuntoMail = '';

    if(type == 1){
      asuntoMail = this.asunto;
      contenidoMail = this.emailContent;
    } else if(type == 2){
      asuntoMail = this.asuntoAnulado;
      contenidoMail = this.emailContent2;
    } else if(type == 3){
      asuntoMail = this.asuntoDevuelto;
      contenidoMail = this.emailContent1;
    }

    setTimeout(() => {
      const data = {
        destinatario: mailToNotify,
        asunto: asuntoMail,
        contenido: contenidoMail
      }

      this.sendMailService.sendMailto(data).subscribe(
        response => {
          //console.log("Exito, correo enviado");
          // this.showmsj = true;
          // this.msjExito = `Correos enviados exitosamente.`;

          // setTimeout(() => {
          //   this.showmsj = false;
          //   this.msjExito = '';
          // }, 4000)

        },
        error => {
          console.log(`Error, no se ha podido enviar el correo al proveedor.`, error)
          const msjError = `Error, no se ha podido enviar el correo al proveedor, intente nuevamente.`;
          this.callMensaje(msjError,false)
        }
      );
    }, 500);
  }


  setAprobadoPor(id: string){
    this.cabOCService.updateAprobadoCotizacion(this.trTipoSolicitud, this.noSolTmp,id).subscribe(
      (response) => {
        //console.log('ACTUALIZADO CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

  setFinancieroPor(id: string){
    this.cabOCService.updateFinancieroCotizacion(this.trTipoSolicitud, this.noSolTmp,id).subscribe(
      (response) => {
        //console.log('ACTUALIZADO CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

    /////////////////////////////////////////////////APROBACION PRESUPUESTARIA//////////////////////////////////////////////////
    aprobPreps: boolean = false;

    checkAprobPrep(nivel: number) {
      if (nivel == 60) {
        this.aprobPreps = true;
      } else {
        this.aprobPreps = false;
      }
    }

    setMotivo: string = 'NO';

    setMotivoDev() {
      if (this.cabecera.cabSolOCAprobPresup == 'SI') {
        this.setMotivo = 'NO';
      } else {
        this.setMotivo = 'SI';
      }
      //this.setMotivo = !this.setMotivo;
    }
    FechaMaxEntrega(fechas: string) {
      let fecha = new Date(fechas);
      fecha.setMonth(fecha.getMonth()+6)
      let Fechatrans=this.formatDateToYYYYMMDD(fecha)
      return Fechatrans
      // return fechaMax;
    }



  

    
}
