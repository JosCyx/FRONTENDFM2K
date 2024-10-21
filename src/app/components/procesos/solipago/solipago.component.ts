import { Component, OnInit, Input, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { CabeceraPago } from 'src/app/models/procesos/solcotizacion/CabeceraPago';
import { GlobalService } from 'src/app/services/global.service';
import { DetallePago } from 'src/app/models/procesos/solcotizacion/DetallePago';
import { format, parseISO, set } from 'date-fns';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';
import { DetPagoService } from 'src/app/services/comunicationAPI/solicitudes/det-pago.service';
import { TrackingService } from 'src/app/services/comunicationAPI/seguridad/tracking.service';
import { DetCotOCService } from 'src/app/services/comunicationAPI/solicitudes/det-cot-oc.service';
import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';
import { CookieService } from 'ngx-cookie-service';
import { RuteoAreaService } from 'src/app/services/comunicationAPI/seguridad/ruteo-area.service';
import { SPDocumentacionComponent } from './sp-documentacion/sp-documentacion.component';
import { SendEmailService } from 'src/app/services/comunicationAPI/solicitudes/send-email.service';
import { NivGerenciaService } from 'src/app/services/comunicationAPI/solicitudes/niv-gerencia.service';
import { SharedService } from 'src/app/services/shared.service';
import { SpDestinoComponent } from './sp-destino/sp-destino.component';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { FacturasPagoService } from 'src/app/services/comunicationAPI/solicitudes/facturas-pago.service';
import * as _ from 'lodash';
import { SolTimeService } from 'src/app/services/comunicationAPI/solicitudes/sol-time.service';


interface Factura {
  noSol?: number;
  idFactura?: number;
  noFactura?: number;
  numero: string;
  fecha: Date | string;
  proveedor: string;
  provRuc: string;
  ordCompra: string;
  valorTotal: number;
  detalles: DetalleFactura[];
  new: boolean;
}

interface DetalleFactura {
  id?: number;
  ordenCompra?: string;
  idDetalle?: number;
  idFactura?: number;
  noDetalle?: number;
  itemProd: string;
  descProd: string;
  cantidad: number;
  valorUnitario: number;
  descuento: number;
  subTotal: number;
  checkC: boolean;
  checkS: boolean;
}

interface RuteoArea {
  rutareaNivel: number;
  // Otras propiedades si es necesario
}

interface ResponseTrack {
  solTrTipoSol: number;
  solTrNumSol: number;
}

interface DetalleSolPagos {
  itemDesc: string;
  cantidadContrat: number;
  cantidadRecibid: number;
  valorUnitario: number;
  subTotal: number;
}
interface SolicitudData {
  detalles: any[];
  cabecera: any;
  facturas: any[];
  detalleFacturas: any[];
}

@Component({
  selector: 'app-solipago',
  templateUrl: './solipago.component.html',
  styleUrls: ['./solipago.component.css'],
})
export class SolipagoComponent implements OnInit, OnDestroy {
  responseTRK: ResponseTrack = { solTrTipoSol: 0, solTrNumSol: 0 };

  empleado: string = '';
  empleados: any[] = [];
  showArea: string = '';
  empleadosList$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;

  areaList$!: Observable<any[]>;
  areas: any[] = [];
  areaNmco!: string;
  solNumerico!: string;
  fecha: Date = new Date();
  fechaFormateada: string = this.formatDateToSpanish(this.fecha);
  receptor!: string;
  //*Variables de input para solicitar tipo de solicitud  y no solicitud
  valorinputOC: string = '';
  noSolicinput!: number;
  //Creacion de Lista para guardar los tipos de solicit y no solicitud
  detalleSolPagos: any[] = [];

  changeview: string = this.serviceGlobal.solView;
  //changeview: string = 'editar';
  //Mensaje
  msjExito!: string;
  msjError!: string;
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  //
  SolID: number = this.serviceGlobal.solID;
  //*variables de cabecera
  cab_id_area!: number;
  cab_id_dept!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_ordencompra!: string;
  cab_nofactura!: string;
  cab_fechafactura!: Date;
  cab_proveedor!: string;
  cab_rucproveedor!: string;
  cab_observa!: string;
  cab_aplicarmult!: string;
  cab_valordescontar!: 0;
  cab_totalautorizado!: number;
  cab_recibe!: string;
  cab_fechaInspeccion!: Date;
  cab_cancelarOrden!: string;
  cab_observCancelacion: string = '';
  cab_estado: string = 'A'; //estado inicial Activo
  cab_NoSolOC!: string;
  //*
  cabecera!: CabeceraPago;
  detallePago: DetallePago[] = [];
  solicitudEdit!: SolicitudData;

  //* Variables para guardar el traking
  trTipoSolicitud: number = 3; //indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10; //nivel de emision por defecto
  trIdNomEmp!: string;
  //
  Total: number = 0;
  //
  //TIPO DE BUSQUEDAS
  tipobusqueda: string = 'nombre';
  buscarProveedor: string = '';
  //
  alertBool: boolean = false;
  alertBoolError: boolean = false;
  alertText: string = '';
  //
  empleadoEdi: any[] = [];
  proveedores: any[] = [];
  //variables compartidas con los demas componentes
  @ViewChild(SPDocumentacionComponent) spDocumentacion!: SPDocumentacionComponent;
  @ViewChild(SpDestinoComponent) spDestino!: SpDestinoComponent;
  @Input() sharedTipoSol: number = 3;
  @Input() sharedNoSol!: number;
  estadoSol: string = '10';
  numericoSol!: string;

  detallesToDestino: any[] = [];
  setDestino: boolean = false;
  tipoSolOc: string = 'F';

  //Variables para validacion de fecha 
  fechaminina: Date = new Date();
  fechamaxima: Date = new Date();

  fechaMin: string = '';
  fechaMax: string = '';
  areaUserCookie: number = Number(this.cookieService.get('userArea'));
  numeroSolicitudEmail: string = '';
  tipoSolicitudEmail: string = '';
  nivelProcesoEmail: string = '';
  devolucion: boolean = false;//controla si la solicitud esta siendo devuelta o no
  motivoDevEditar: string = '';
  solicitudFrom: string = '';

  isSaved: boolean = false;

  /////////////////////////////////////////FACTURAS///////////////////////////////////////////////////
  facturasList: Factura[] = [];//almacena las facturas que se enviaran a la API

  //almacena la cabecera de la factura que se registra en el momento
  factura: Factura = {
    numero: '',
    fecha: new Date(),
    proveedor: '',
    provRuc: '',
    ordCompra: '',
    valorTotal: 0,
    detalles: [],
    new: false
  };

  //almacena los detalles de una factura que se registra en el momento sin modificaciones
  detalleFactDefault: DetalleFactura[] = [];

  areaUserCookieId: number = 0;

  constructor(
    private empService: EmpleadosService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private cabPagoService: CabPagoService,
    private detPagoService: DetPagoService,
    private solTrckService: TrackingService,
    private detSolService: DetCotOCService,
    private router: Router,
    private provService: ProveedorService,
    public serviceGlobal: GlobalService,
    private cookieService: CookieService,
    private ruteoService: RuteoAreaService,
    private sendMailService: SendEmailService,
    private nivGerenciaService: NivGerenciaService,
    private sharedService: SharedService,
    private dialogService: DialogServiceService,
    private facturasService: FacturasPagoService,
    private solTimeService: SolTimeService
  ) {
    this.areaUserCookieId = this.cookieService.get('userArea') ? parseInt(this.cookieService.get('userArea')) : 0;
    /*//se suscribe al observable de aprobacion y ejecuta el metodo enviarSolicitud
    this.sharedService.aprobarsp$.subscribe(() => {
      //console.log("Aprobando solicitud...");
      this.enviarSolicitud();
    });

    //se suscribe al observable de anulacion y ejecuta el codigo para anular la solicitud
    this.sharedService.anularsp$.subscribe(() => {
      //console.log("Anulando solicitud...");
      this.anularSolicitud();
    });

    //se suscribe al observable de no autorizacion y ejecuta el codigo para no autorizar la solicitud
    this.sharedService.noautorizarsp$.subscribe(() => {
      //console.log("No autorizando solicitud...");
      this.noAutorizar();
    });*/
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  calcularSubtotal(det: any): void {
    det.subTotal = det.cantidadRecibid * det.valorUnitario;
  }

  validarCantidad(det: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const valorIngresado = parseInt(inputElement.value, 10);
    if (valorIngresado > det.itemCant) {
      inputElement.value = det.itemCant.toString(); // Establecer el valor mínimo si es menor que 1
      //QUE EL ELEMENTO DE LA LISTA OBTENGA EL MISMO VALOR 
      det.cantidadRecibid = det.itemCant;

    }
  }
  ValidarcantidadRe(event: Event): void {
    const patron: RegExp = /^[0-9]+$/;
    const inputElement = event.target as HTMLInputElement;
    const valorIngresado = inputElement.value;

    if (!patron.test(valorIngresado)) {
      inputElement.value = inputElement.defaultValue;
    }

  }
  validarNumero(event: Event): void {
    const patron: RegExp = /^[0-9]+(\.[0-9]+)?$/;
    const inputElement = event.target as HTMLInputElement;
    const valorIngresado = inputElement.value;

    if (!patron.test(valorIngresado)) {
      inputElement.value = inputElement.defaultValue;
    }
  }

  ngOnInit(): void {

    this.fechaminina = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.fechamaxima = new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate());
    this.fechaMax = this.formatDateToYYYYMMDD(this.fechamaxima);
    this.fechaMin = this.formatDateToYYYYMMDD(this.fechaminina);
    setTimeout(() => {

      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadoEdi = data;
      });

      this.areaList$ = this.areaService.getAreaList();

      this.nivelRut$ = this.nivRuteService
        .getNivelruteo()
        .pipe(map((niv) => niv.sort((a, b) => a.nivel - b.nivel)));

      this.areaList$.subscribe((data) => {
        this.areas = data;
      });
    }, 100);
    if (this.changeview == 'editar') {
      this.editSolicitud();
      this.isSaved = true;
    } else if (this.changeview == 'crear') {
      setTimeout(async () => {
        await this.guardarTrancking();
      }, 1500);
    }
  }

  // Manejar el evento beforeunload
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(): void {
    if (!this.isSaved) {
      this.deleteLastTracking();
    }
  }

  ngOnDestroy(): void {
    if (!this.isSaved) {
      this.deleteLastTracking();
    }
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  verificartexto(): void {
    const patron: RegExp = /^[a-zA-ZñÑ\s]*$/;
    if (!patron.test(this.receptor)) {
      //borrar el ultimo caracter ingresado
      console.log('El inspector no puede contener el número', this.receptor);
      // this.inspector = this.inspector.substring(0, this.inspector.length - 1);
      this.receptor = this.receptor.replace(/[^a-zA-Z\s]/g, '');
    }
  }
  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleados = data;
      });
    } else if (this.receptor.length > 2) {
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }

  selectEmpleado(): void {
    setTimeout(async () => {

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
            //console.log("Empleado ID:",this.trIdNomEmp);
            this.depSolTmp = emp.empleadoIdDpto;
            this.cab_id_dept = emp.empleadoIdDpto;
            this.cab_id_area = emp.empleadoIdArea;

            for (let area of this.areas) {
              if (area.areaIdNomina == emp.empleadoIdArea) {

                this.showArea = area.areaDecp;

                this.areaNmco = area.areaNemonico.trim();
                console.log("setDestino", this.setDestino);

                //busca el nuevo nombre de la solicitud y lo asigna a las variables para poder usarlo en el destino
                setTimeout(async () => {


                  this.getSolName(this.responseTRK.solTrNumSol);
                }, 1000);

                //console.log("Empleado area ID:",this.cab_area);
              } else if (emp.empleadoIdArea === 0) {
                this.showArea = 'El empleado no posee un area asignada.';
              }
            }
          }
        }
      }
    }, 1000);
  }
  async changeView(view: string) {
    this.changeview = view;
    this.clear();
  }
  //* Metodo para agregar la Cabecera
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
  //Limpiar en modulo de crear pago
  cancelar(): void {
    this.deleteLastTracking();
    this.clear();
    this.ngOnInit();
    this.cancelarDes();
    this.sharedService.spDocumentacionChange();
  }
  //Limpiar en modulo Editar
  cancelarEdi(): void {
    this.serviceGlobal.tipoSolBsq = 3;
    this.router.navigate(['allrequest']);
    this.clear();
  }
  EliminarSolPo(TipoSolicitud: number, NoSolicitud: number) {
    console.log("tipo solicitud", TipoSolicitud, "no solicitud", NoSolicitud);
    this.cabPagoService.DeleteSolPago(TipoSolicitud, NoSolicitud).subscribe(
      {
        next: data => {
          const msjExito = 'Solicitud de Pago Eliminada Exitosamente';
          this.callMensaje(msjExito, true)
          setTimeout(() => {
            this.router.navigate(['allrequest']);
          }, 3000);
        },
        error: error => {
          console.error('Error al eliminar la solicitud: ', error);
          const msjError = 'Error al eliminar la solicitud';
          this.callMensaje(msjError, false)
        }
      }
    )


  }

  cancelarDes() {
    console.log("cancelar destino")
    this.sharedService.spDestinoChange();
    //this.spDestino.cancelarDestino();
  }

  //
  clear(): void {
    this.empleado = '';
    this.cab_ordencompra = '';
    this.showArea = '';
    this.cab_nofactura = '';
    this.cab_fechafactura = new Date();
    this.cab_proveedor = '';
    this.cab_rucproveedor = '';
    this.cab_observa = '';
    this.cab_aplicarmult = '';
    this.cab_valordescontar = 0;
    this.cab_totalautorizado = 0;
    this.cab_recibe = '';
    this.cab_fechaInspeccion = new Date();
    this.cab_cancelarOrden = '';
  }

  getSolName(noSol: number) {
    const noSolString = noSol.toString();
    const paddedNoSol = noSolString.padStart(6, '0');
    this.solNumerico = `SP ${this.areaNmco} ${this.trTipoSolicitud}-${paddedNoSol}`;
    console.log("solNumerico", this.solNumerico);
  }


  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  /*getLastSol(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.solTrckService.getLastSolicitud(this.trTipoSolicitud).subscribe(
        (resultado) => {
          if (resultado === 0) {
            console.log('No se ha registrado ninguna solicitud de este tipo.');
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
  }*/
  //
  guardarTrancking(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        //this.trLastNoSol = await this.getLastSol();
        //this.noSolTmp = this.trLastNoSol;

        const dataTRK = {
          solTrTipoSol: this.trTipoSolicitud,
          solTrNumSol: 0,
          solTrNivel: this.trNivelEmision,
          solTrIdEmisor: this.cookieService.get('userIdNomina'),
        };

        console.log('1. guardando tracking: ', dataTRK);
        this.solTrckService.generateTracking(dataTRK).subscribe(
          (response: any) => {

            this.responseTRK = response?.solTrTipoSol && response?.solTrNumSol ? response : { solTrTipoSol: 0, solTrNumSol: 0 };

            this.sharedNoSol = this.responseTRK.solTrNumSol;
            this.sharedTipoSol = this.responseTRK.solTrTipoSol;

            //GUARDA EL VALOR DEL NUMERO DE LA SOLICITUD
            this.noSolTmp = this.responseTRK.solTrNumSol;
            this.trLastNoSol = this.responseTRK.solTrNumSol;

            console.log('Tracking asignado: ', this.responseTRK.solTrNumSol);
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
  //Guarda la solicitud con  estado emitido
  async generarSolicitud() {
    this.isSaved = true;//controla que la solicitud se haya guardado
    this.getSolName(this.trLastNoSol);
    this.numeroSolicitudEmail = this.solNumerico;
    this.tipoSolicitudEmail = 'Orden de Pago';

    let ifDestino = '';
    if (this.setDestino == true) {
      ifDestino = 'S';
    } else if (this.setDestino == false) {
      ifDestino = 'N';
    }

    const dataCAB = {
      cabPagoNumerico: this.solNumerico,
      cabPagoTipoSolicitud: this.trTipoSolicitud,
      cabPagoNoSolicitud: this.trLastNoSol,
      cabPagoIdAreaSolicitante: this.cab_id_area,
      cabPagoIdDeptSolicitante: this.cab_id_dept,
      cabPagoSolicitante: this.trIdNomEmp,
      cabPagoFechaEmision: this.cab_fecha,
      cabPagoFechaEnvio: this.cab_fecha,
      cabPagoNumFactura: '',
      cabPagoFechaFactura: this.cab_fechafactura,
      cabPagoProveedor: this.cab_proveedor,
      cabPagoRucProveedor: this.cab_rucproveedor,
      cabpagototal: this.Total,
      cabPagoObservaciones: this.cab_observa,
      cabPagoAplicarMulta: this.cab_aplicarmult,
      cabPagoValorMulta: this.cab_valordescontar,
      cabPagoValorTotalAut: this.cab_totalautorizado,
      cabPagoReceptor: this.cab_recibe,
      cabPagoFechaInspeccion: this.cab_fechaInspeccion,
      cabPagoCancelacionOrden: this.cab_cancelarOrden,
      cabPagoObservCancelacion: this.cab_observCancelacion,
      cabPagoEstado: this.cab_estado,
      cabPagoEstadoTrack: this.trNivelEmision,
      cabPagoIdEmisor: this.cookieService.get('userIdNomina'),
      cabPagoApprovedBy: 'XXXXXX',
      cabPagoNoSolOC: this.cab_NoSolOC,
      cabPagoValido: 1,
      cabPagoMotivoDev: 'NOHAYMOTIVO',
      cabPagoFrom: this.solicitudFrom,
      cabPagoIfDestino: ifDestino,
      cabPagoType: 'new'
    };

    //enviar datos de cabecera a la API
    console.log('2. guardando solicitud...', dataCAB);
    await this.cabPagoService.addSolPag(dataCAB, this.cookieService.get('userIdNomina'), 'Envío').subscribe(
      (response) => {
        /*const msjExito = 'Solicitud de Pago Generada Exitosamente.';
        this.callMensaje(msjExito, true);*/
        //this.AddDetSolPago();
        this.saveFacturas(this.solNumerico);
        
        this.saveOCValues();

        /*this.solTimeService.saveSolTime(
          this.trTipoSolicitud,
          this.trLastNoSol,
          this.cookieService.get('userIdNomina'),
          this.cookieService.get('userName'),
          this.trNivelEmision,
          'Envío'
        );*/

        //controlar que este mensaje solo se muestre si todas las facturas se guardaron exitosamente con todos sus detalles
        if (this.correctSave) {
          this.callMensaje(`Solicitud de Pago N°${this.solNumerico} generada exitosamente.`, true);
          //this.saveOCValues();
          setTimeout(() => {
            this.serviceGlobal.tipoSolBsq = 3;
            this.router.navigate(['allrequest']);
          }, 3000)
        } else {
          console.log("Error al guardar la solicitud de pago");
          console.log("Errores: ", this.errors);
          this.callMensaje(`Error al generar la solicitud de pago N° ${this.solNumerico}.`, false);
        }
      },
      (error) => {
        this.isSaved = false;
        this.deleteLastTracking();
        console.log('error al guardar la cabecera: ', error);
        const mensaje = "Ha habido un error al guardar los datos, por favor revise que haya ingresado todo correctamente e intente de nuevo.";
        this.callMensaje(mensaje, false);
      }
    );
  }

  async deleteLastTracking() {
    const tipoSol = this.responseTRK.solTrTipoSol;
    const noSol = this.responseTRK.solTrNumSol;

    this.solTrckService.deleteTracking(tipoSol, noSol).subscribe(
      response => {
        console.log("Tracking eliminado.");
      },
      error => {
        console.log("Error al eliminar el tracking: ", error);
      }
    );
  }

  //Guardar el ID DEL QUE RECIBE
  saveReceptor() {
    console.log("setDestino", this.setDestino);
    if (this.changeview == 'editar') {
      for (let emp of this.empleadoEdi) {
        if (emp.empleadoNombres + ' ' + emp.empleadoApellidos == this.receptor) {
          this.cabecera.cabPagoReceptor = emp.empleadoIdNomina;
        }
      }
    } else if (this.changeview == 'crear') {
      for (let emp of this.empleados) {
        if (emp.empleadoNombres + ' ' + emp.empleadoApellidos == this.receptor) {
          this.cab_recibe = emp.empleadoIdNomina
          //console.log("Empleado ID:",this.trIdNomEmp);
        }
      }
    }

  }

  destinoIO: boolean = false;
  showItDt: string = 'items';

  setID(valor: string) {
    this.showItDt = valor;
  }

  showNewFactBTN: boolean = false;
  getDetFromOC() {
    this.showNewFactBTN = false;
    this.detalleSolPagos = [];
    this.factura.detalles = [];
    this.detalleFactDefault = [];

    if (this.changeview == 'crear') {
      this.facturasList = [];
    }

    if (this.valorinputOC == '') {
      this.callMensaje('Por favor ingrese el número de orden de compra.', false);
    } else {
      if (this.detalleFactDefault.length != 0) {
        //setear factura.detalles con los datos de detalleFactDefault
        this.factura.detalles = _.cloneDeep(this.detalleFactDefault);
        this.factura.ordCompra = this.valorinputOC.toUpperCase();
        this.cab_NoSolOC = this.valorinputOC.toUpperCase();
        this.showNewFactBTN = true;

      } else {
        this.detPagoService.DetOrdenCompras(this.valorinputOC).subscribe({
          next: data => {
            //console.log("data", data);
            //sumar todos los valores de la columna detcantidad
            const totalCant = data.reduce((acc: any, cur: any) => acc + cur.detcantidad, 0);

            if (data[0].detEstadoOC != 1) {
              this.callMensaje('Error, la orden de compra ingresada no se encuentra abierta, por favor intente con una orden abierta.', false);
            } else if (totalCant == 0) {
              if (this.changeview == 'crear') {
                this.callMensaje('Error, la orden de compra ingresada no tiene valores pendientes, por favor intente con una orden que tenga valores pendientes de pago.', false);
              }
            } else {

              this.factura.detalles = data.map((det: any) => ({
                itemProd: det.detcodProducto,
                descProd: det.detdesProducto,
                cantidad: det.detcantidad,
                valorUnitario: det.detprecio,
                descuento: 0,
                subTotal: det.detTotal,
                checkC: true,
                checkS: true
              }));

              //guarda los datos de la orden de compra sin modificaciones
              this.detalleFactDefault = data.map((det: any) => ({
                ordenCompra: det.detOrden,
                itemProd: det.detcodProducto,
                descProd: det.detdesProducto,
                cantidad: det.detcantidad,
                valorUnitario: det.detprecio,
                descuento: 0,
                subTotal: det.detTotal,
                check: true,
                checkS: true
              }));

              /*this.detalleSolPagos = data.map((ini: any) => ({
                idDetalle: ini.detId,
                itemDesc: ini.detdesProducto,
                itemCant: ini.detcantidad,
                cantidadRecibid: ini.detcantidad,
                valorUnitario: ini.detprecio,
                subTotal: ini.detTotal
              }))*/

              this.destinoIO = true;
              this.factura.ordCompra = this.valorinputOC.toUpperCase();
              this.cab_NoSolOC = this.valorinputOC.toUpperCase();
              this.showNewFactBTN = true;
              if (this.changeview == 'crear') {
                this.callMensaje('Orden de compra encontrada, a continuación continúe a registrar las facturas.', true);
              }
            }


          },
          error: error => {
            console.error('Error al obtener la orden de compra: ', error);
            if (error.status == 404) {
              this.callMensaje('Error, no se ha encontrado una orden de compra con los datos ingresados.', false);
            }
          }
        })
      }
    }
  }

  //ESTE METODO YA NO FUNCIONARÁ
  //* Agregamos los detalles de pago a base
  /*AddDetSolPago() {
    for (let detPago of this.detalleSolPagos) {
      const dataDetPag = {
        detPagoTipoSol: this.trTipoSolicitud,
        detPagoNoSol: this.trLastNoSol,
        detPagoIdDetalle: detPago.idDetalle,
        detPagoItemDesc: detPago.itemDesc,
        detPagoCantContratada: detPago.itemCant,
        detPagoCantRecibida: detPago.cantidadRecibid,
        detPagoValUnitario: detPago.valorUnitario,
        detPagoSubtotal: detPago.subTotal,
      };
      this.detPagoService.addSolDetPago(dataDetPag).subscribe(
        (response) => {
          console.log('Detalle Guardado ');
        },
        (error) => {
          console.log('No se puede guardar el detalle', error);
          this.callMensaje('No se ha podido guardar el detalle.', false);
        }
      );
    }
  }*/



  //Calculo de Total
  calculoTotal() {
    this.Total = 0;
    for (let PagoTotal of this.detalleSolPagos) {
      this.Total = this.Total + PagoTotal.subTotal;
    }
  }
  //Calculo  Total de Edicion
  calculoEditotal() {
    this.cabecera.cabpagototal = 0;
    for (let PagoTotal of this.detallePago) {
      this.cabecera.cabpagototal = this.cabecera.cabpagototal + PagoTotal.detPagoSubtotal;
    }
  }


  async editSolicitud() {

    await this.getSoliPagos();
    await this.saveData();
    this.serviceGlobal.loadingSolicitud = true;
  }
  //* Obtener los datos de cabecera de solicitud y detalle
  async getSoliPagos() {
    try {
      const data = await this.cabPagoService
        .getSolPagobyId(this.SolID)
        .toPromise();
      this.solicitudEdit = data;
      //console.log('solicitudEdit', this.solicitudEdit);
    } catch (error) {
      console.error('Error en la solicitud', error);
    }
  }
  async saveData() {
    this.cabecera = this.solicitudEdit.cabecera;
    this.noSolTmp = this.cabecera.cabPagoNoSolicitud;
    this.estadoTrkTmp = this.cabecera.cabPagoEstadoTrack;
    this.areaSolTmp = this.cabecera.cabPagoIdAreaSolicitante;
    this.depSolTmp = this.cabecera.cabPagoIdDeptSolicitante;
    this.numericoSol = this.cabecera.cabPagoNumerico;
    this.solNumerico = this.cabecera.cabPagoNumerico;//se usa para mostrar el mensaje de exito
    this.numeroSolicitudEmail = this.cabecera.cabPagoNumerico;
    this.tipoSolicitudEmail = 'Orden de Pago';
    this.getNombreNivel(this.cabecera.cabPagoEstadoTrack);


    if (this.cabecera.cabPagoIfDestino == 'S') {
      this.setDestino = true;
    } else if (this.cabecera.cabPagoIfDestino == 'N') {
      this.setDestino = false;
    }

    if (this.cabecera.cabPagoFrom == 'F') {
      this.setDestino = true;
    } else if (this.cabecera.cabPagoFrom == 'S') {
      this.setDestino = this.setDestino;
    }


    this.setCancelacionOrden(this.cabecera.cabPagoCancelacionOrden);

    this.estadoSol = this.cabecera.cabPagoEstadoTrack.toString();
    this.sharedTipoSol = this.cabecera.cabPagoTipoSolicitud;
    this.sharedNoSol = this.cabecera.cabPagoNoSolicitud;

    if (this.cabecera.cabPagoType == 'legacy') {
      console.log("solicitud antigua")
      //agrega los detalles de la solicitud a la lista de detalles
      for (let det of this.solicitudEdit.detalles) {
        this.detallePago.push(det as DetallePago);
      }
      //ordenamiento de detalle de solicitud pago
      this.detallePago.sort((a, b) => a.detPagoIdDetalle - b.detPagoIdDetalle);
    } else if (this.cabecera.cabPagoType == 'new') {
      console.log("solicitud nueva")

      //detalles de las facturas
      let detallesTMP: any[] = [];

      for (let det of this.solicitudEdit.detalleFacturas) {
        //formatear la fecha al formato

        const detalle: DetalleFactura = {
          idDetalle: det.detFactId,
          idFactura: det.detFactIdFactura, //guarda el id de la fcatura al que pertenece el detalle
          noDetalle: det.detFactNoDetalle, //guarda el numero de detalle de la factura
          itemProd: det.detFactIdProducto,
          descProd: det.detFactDescpProducto,
          cantidad: det.detFactCantProducto,
          valorUnitario: det.detFactValorUnit,
          descuento: det.detFactDescuento,
          subTotal: det.detFactTotal,
          checkC: true,
          checkS: true
        };

        detallesTMP.push(detalle);
      }

      //agrega las facturas a la lista de facturasList mapeando las propiedades con los nombres del tipo Factura
      for (let fact of this.solicitudEdit.facturas) {

        console.log("fact", fact);

        const factura: Factura = {
          noSol: fact.factSpNoSol, //guarda el numero de solicitud de pago
          idFactura: fact.factSpId, //guarda el id de la factura
          noFactura: fact.factSpNoFactura, //guarda el numero de factura de la solicitud
          numero: fact.factSpNumFactura,
          //fecha: fact.factSpFechaFactura,
          fecha: this.formatFechaFact(fact.factSpFechaFactura),
          proveedor: fact.factSpProvFactura,
          provRuc: fact.factSpRucProvFactura,
          ordCompra: fact.factSpNumOrdenCompra,
          valorTotal: fact.factSpMontoFactura,
          detalles: [],
          new: false
        };

        for (let det of detallesTMP) {
          if (det.idFactura == fact.factSpId) {
            factura.detalles.push(det);
          }
        }

        //agregar la factura a la lista de facturas
        this.facturasList.push(factura);

      }

      //agrega los detalles de la solicitud a la lista de detalles del objeto factura
      this.valorinputOC = this.cabecera.cabPagoNoSolOC;
      this.getDetFromOC();

      this.cargarOCDefault(this.cabecera.cabPagoNoSolOC)

      console.log("facturasList", this.facturasList);
      setTimeout(() => {
        this.verifyTotal();
      }, 500);
    }

    //lista de detalles para el destino
    // this.detallesToDestino = this.detallePago.map((detalle: any) => {
    //   return {
    //     idDetalle: detalle.detPagoIdDetalle,
    //     descpDetalle: detalle.detPagoItemDesc,
    //     destinoDetalle: true
    //   };
    // });
    //formatear la fecha de la solicitud de pago
    this.fechaFormateada = this.formatDateToSpanish(new Date(this.cabecera.cabPagoFechaEmision))
    //
    this.formatFechaInspeccion();
    //
    this.formatFechaFactura();
    this.getInspector();
    this.getLastNivel();

  }
  //2023-12-29T00:00:00
  formatFechaFact(fecha: string) {
    //recortar "T00:00:00" al contenido del parametro fecha
    const fechaRecortada = fecha.substring(0, 10);
    return fechaRecortada;
  }


  lastNivel: string = '';

  facturaTMP: Factura = {
    numero: '',
    fecha: new Date(),
    proveedor: '',
    provRuc: '',
    ordCompra: '',
    valorTotal: 0,
    detalles: [],
    new: false
  }

  valorTotalTMP: number = 0;
  detallesTmpforEdit: DetalleFactura[] = [];

  showDltFactBTN: boolean = true;
  //SE EJECUTA AL DARLE CLICK A UNA FACTURA DE LA LISTA
  selectFactura(factura: Factura) {
    this.showDltFactBTN = false;
    // Crear una copia superficial del objeto factura y asignarla a this.facturaTMP
    //this.facturaTMP = Object.freeze(Object.assign({}, factura));

    //clona el objeto factura y lo asigna a this.facturaTMP
    this.facturaTMP = _.cloneDeep(factura);
    this.detallesTmpforEdit = _.cloneDeep(factura.detalles);
    console.log("detalles sin edicion", this.detallesTmpforEdit);

    // Asignar la factura original a this.factura
    this.factura = factura;

    //console.log("facturatmp", this.facturaTMP);
    this.valorinputOC = factura.ordCompra;
    //console.log("factura seleccionada: ", this.factura);

    this.verifyTotal();
  }

  /*metodo() {
    console.log("lista de facturas:", this.detalleFactDefault);
  }*/
  cargarOCDefault(valorBusqueda: string) {
    this.detPagoService.DetOrdenCompras(valorBusqueda).subscribe(
      {
        next: data => {
          //console.log("data", data);
          //guarda los datos de la orden de compra sin modificaciones
          this.detalleFactDefault = data.map((det: any) => ({
            id: det.id,
            ordenCompra: det.detOrden,
            itemProd: det.detcodProducto,
            descProd: det.detdesProducto,
            cantidad: det.detcantidad,
            valorUnitario: det.detprecio,
            descuento: 0,
            subTotal: det.detTotal,
            check: true,
            checkS: true
          }));
        },
        error: error => {
          console.error('Error al obtener la orden de compra: ', error);

        }
      })

  }

  async getInspector() {
    await this.empService.getEmpleadosList().subscribe((data) => {
      this.empleadoEdi = data;
      for (let emp of this.empleadoEdi) {
        if (emp.empleadoIdNomina == this.cabecera.cabPagoReceptor) {
          this.receptor = emp.empleadoNombres + ' ' + emp.empleadoApellidos;
        }
      }
    });
    this.getNivelRuteoArea();
  }

  getLastNivel() {
    for (let i = 0; i < this.nivelSolAsignado.length; i++) {
      const element = this.nivelSolAsignado[i];

      //guardar el ultimo elemento de la lista
      if (i === this.nivelSolAsignado.length - 1) {
        const nivel = element.rutareaNivel;
        this.lastNivel = nivel.toString();
      }
    }
  }

  formatFechaInspeccion() {
    /*this.cabecera.cabPagoFechaInspeccion = this.cabecera.cabPagoFechaInspeccion === null ? '':   format(
      parseISO(this.cabecera.cabPagoFechaInspeccion),'yyyy-MM-dd');*/
    if (this.cabecera.cabPagoFechaInspeccion) {
      const fechaMaxEntrega = parseISO(this.cabecera.cabPagoFechaInspeccion);

      if (!isNaN(fechaMaxEntrega.getTime())) {
        // La fecha es válida, ahora puedes formatearla
        this.cabecera.cabPagoFechaInspeccion = format(fechaMaxEntrega, 'yyyy-MM-dd');
      } else {
        // La fecha no es válida, maneja el caso según tus necesidades
        console.error('Fecha máxima de inspeccion no válida:', this.cabecera.cabPagoFechaInspeccion);
      }
    } else {
      // La fecha es undefined, maneja el caso según tus necesidades
      console.error('La fecha máxima de inspeccion es undefined.');
    }
  }

  formatFechaFactura() {
    /*this.cabecera.cabPagoFechaFactura= this.cabecera.cabPagoFechaFactura === null ? '':format(
      parseISO(this.cabecera.cabPagoFechaFactura),'yyyy-MM-dd');*/
    if (this.cabecera.cabPagoFechaFactura) {
      const fechaMaxEntrega = parseISO(this.cabecera.cabPagoFechaFactura);

      if (!isNaN(fechaMaxEntrega.getTime())) {
        // La fecha es válida, ahora puedes formatearla
        this.cabecera.cabPagoFechaFactura = format(fechaMaxEntrega, 'yyyy-MM-dd');
      } else {
        // La fecha no es válida, maneja el caso según tus necesidades
        console.error('Fecha máxima de inspeccion no válida:', this.cabecera.cabPagoFechaFactura);
      }
    } else {
      // La fecha es undefined, maneja el caso según tus necesidades
      console.error('La fecha máxima de inspeccion es undefined.');
    }
  }

  getNombreNivel(nivel: number) {
    this.nivRuteService.getNivelruteo().subscribe(
      (data) => {
        const response = data;
        for (let nivelR of response) {
          if (nivelR.nivel == nivel) {
            this.nivelProcesoEmail = nivelR.descRuteo;
          }
        }
      }
    )
  }
  //
  get estadoTexto(): string {
    switch (this.cabecera.cabPagoEstado) {
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
  correctSave: boolean = true;
  errors: string[] = [];
  //Guardar lo editado de  solicitud de pago
  async savePagoEdit() {
    try {
      console.log('Se guardo la edicion ');
      await this.saveEditCabeceraPago();


      //se mantiene la logica de guardado de solicitudes anteriores puesto que aun existen solicitudes de pago anteriores en proceso
      if (this.cabecera.cabPagoType == 'legacy') {
        await this.saveEditdetPago();
      } else if (this.cabecera.cabPagoType == 'new') {
        await this.saveEditFacturas(this.solNumerico);
        await this.saveFacturas(this.solNumerico);
        this.saveOCValues();

        //controlar que este mensaje solo se muestre si todas las facturas se guardaron exitosamente con todos sus detalles
        if (this.correctSave) {
          this.callMensaje(`Solicitud de Pago N°${this.solNumerico} editada exitosamente.`, true);
          //this.saveOCValues();
        } else {
          console.log("Error al guardar la solicitud de pago");
          console.log("Errores: ", this.errors);
          this.callMensaje(`Error al generar la solicitud de pago N° ${this.solNumerico}.`, false);
        }
      }



      setTimeout(() => {
        this.serviceGlobal.tipoSolBsq = 3;
        this.router.navigate(['allrequest']);
      }, 3000);
    } catch (error) {
      console.error('Error: ' + error);
      const msjError =
        'No se ha podido guardar la solicitud, intente nuevamente.';
      this.callMensaje(msjError, false);
    }
  }
  async saveEditCabeceraPago() {
    let motivoDevolucion = '';
    let aprobPresp = '';
    if (this.devolucion == true) {
      motivoDevolucion = this.motivoDevEditar;
      aprobPresp = 'NO';
    } else if (this.devolucion == false) {
      motivoDevolucion = 'NOHAYMOTIVO';
      aprobPresp = 'SI';
    }


    let ifDestino = '';
    if (this.setDestino == true) {
      ifDestino = 'S';
    } else if (this.setDestino == false) {
      ifDestino = 'N';
    }

    const dataCAB = {
      cabPagoID: this.cabecera.cabPagoID,
      cabPagoNumerico: this.cabecera.cabPagoNumerico,
      cabPagoTipoSolicitud: this.cabecera.cabPagoTipoSolicitud,
      cabPagoNoSolicitud: this.cabecera.cabPagoNoSolicitud,
      cabPagoIdAreaSolicitante: this.cabecera.cabPagoIdAreaSolicitante,
      cabPagoIdDeptSolicitante: this.cabecera.cabPagoIdDeptSolicitante,
      cabPagoSolicitante: this.cabecera.cabPagoSolicitante,
      cabPagoFechaEmision: this.cabecera.cabPagoFechaEmision,
      cabPagoFechaEnvio: this.cabecera.cabPagoFechaEnvio,
      cabPagoNumFactura: this.cabecera.cabPagoNumFactura,
      cabPagoFechaFactura: this.cabecera.cabPagoFechaFactura,
      cabPagoProveedor: this.cabecera.cabPagoProveedor,
      cabPagoRucProveedor: this.cabecera.cabPagoRucProveedor,
      cabpagototal: this.cabecera.cabpagototal,
      cabPagoObservaciones: this.cabecera.cabPagoObservaciones,
      cabPagoAplicarMulta: this.cabecera.cabPagoAplicarMulta,
      cabPagoValorMulta: this.cabecera.cabPagoValorMulta,
      cabPagoValorTotalAut: this.cabecera.cabPagoValorTotalAut,
      cabPagoReceptor: this.cabecera.cabPagoReceptor,
      cabPagoFechaInspeccion: this.cabecera.cabPagoFechaInspeccion,
      cabPagoCancelacionOrden: this.cabecera.cabPagoCancelacionOrden,
      cabPagoObservCancelacion: this.cabecera.cabPagoObservCancelacion,
      cabPagoEstado: this.cabecera.cabPagoEstado,
      cabPagoEstadoTrack: this.cabecera.cabPagoEstadoTrack,
      cabPagoIdEmisor: this.cabecera.cabPagoIdEmisor,
      cabPagoApprovedBy: this.aprobadopor,
      cabPagoFinancieroBy: this.financieropor,
      cabPagoNoSolOC: this.cabecera.cabPagoNoSolOC,
      cabPagoValido: this.cabecera.cabPagoValido,
      cabPagoMotivoDev: motivoDevolucion,
      cabPagoFrom: this.cabecera.cabPagoFrom,
      cabPagoIfDestino: ifDestino,
      cabPagoType: this.cabecera.cabPagoType
    };

    this.cabPagoService
      .updatecabPago(this.cabecera.cabPagoID, dataCAB)
      .subscribe(
        (response) => {
          console.log('Solicitud de Pago Editado');
        },
        (error) => {
          console.log('Error', error);
          const mensaje = "Ha habido un error al guardar los datos de la cabecera, por favor revise que haya ingresado todo correctamente e intente de nuevo.";
          this.callMensaje(mensaje, false);
        }
      );
  }
  async saveEditdetPago() {
    for (let Depago of this.detallePago) {
      const data = {
        detPagoID: Depago.detPagoID,
        detPagoTipoSol: this.cabecera.cabPagoTipoSolicitud,
        detPagoNoSol: this.cabecera.cabPagoNoSolicitud,
        detPagoIdDetalle: Depago.detPagoIdDetalle,
        detPagoItemDesc: Depago.detPagoItemDesc,
        detPagoCantContratada: Depago.detPagoCantContratada,
        detPagoCantRecibida: Depago.detPagoCantRecibida,
        detPagoValUnitario: Depago.detPagoValUnitario,
        detPagoSubtotal: Depago.detPagoSubtotal,
      };
      console.log('se edito detalle pago', data);
      this.detPagoService.updatedetpago(Depago.detPagoID, data).subscribe(
        (response) => {
          console.log('Detalle de pago actualizado');
        },
        (error) => {
          console.log('Error', error);
          const mensaje = "Ha habido un error al guardar los datos de los detalles, por favor revise que haya ingresado todo correctamente e intente de nuevo.";
          this.callMensaje(mensaje, false);
        }
      );
    }
  }
  //Limpiar los campos de Proveedor y Ruc
  limpiarCampos(): void {
    this.cab_rucproveedor = '';
    this.buscarProveedor = '';
    this.cab_proveedor = '';
    this.cabecera.cabPagoProveedor = '';
    this.cabecera.cabPagoRucProveedor = '';
  }
  //Buscar  Proveedor
  searchProveedor(datos: string): void {
    try {
      if (datos.length > 2) {
        //console.log('Buscar Proveedor: ', datos);
        this.provService.getProveedorByNombre(datos).subscribe({
          next: (data) => {
            this.proveedores = data;
            //console.log('Proveedor ', this.proveedores);
            if (this.proveedores.length > 0) {
              if (this.changeview == 'crear') {
                this.cab_proveedor = this.proveedores[0].prov_nombre;
                this.cab_rucproveedor = this.proveedores[0].prov_ruc;
                this.factura.proveedor = data[0].prov_nombre;
                this.factura.provRuc = data[0].prov_ruc;
              } else if (this.changeview == 'editar') {
                this.cabecera.cabPagoProveedor =
                  this.proveedores[0].prov_nombre;
                this.cabecera.cabPagoRucProveedor =
                  this.proveedores[0].prov_ruc;
                this.factura.proveedor = data[0].prov_nombre;
                this.factura.provRuc = data[0].prov_ruc;
              }
            }
          },
          error: (error) => {
            ;
            console.error('error en buscar proveedor: ', error.error.title);
          },
          complete: () => console.info('completado'),
        });
      }
    } catch (error) {
      console.error('error en buscar proveedor: ', error);
    }
  }
  //Buscar proveedor por RUC
  searchProveedorRuc(datos: string): void {
    try {
      console.log('Buscar Proveedor por RUC: ', datos);
      this.provService.getProveedorByRUC(datos).subscribe({
        next: (data) => {
          console.log('mis datos ', data);
          if (data) {
            if (this.changeview == 'crear') {
              this.cab_proveedor = data[0].prov_nombre;
              this.cab_rucproveedor = data[0].prov_ruc;
              this.factura.proveedor = data[0].prov_nombre;
              this.factura.provRuc = data[0].prov_ruc;
            } else if (this.changeview == 'editar') {
              this.cabecera.cabPagoProveedor = data[0].prov_nombre;
              this.cabecera.cabPagoRucProveedor = data[0].prov_ruc;
              this.factura.proveedor = data[0].prov_nombre;
              this.factura.provRuc = data[0].prov_ruc;
              console.log(
                'Proveedor  de cabecera',
                this.cabecera.cabPagoProveedor
              );
              console.log(
                'Proveedor  de RUC CABECERA',
                this.cabecera.cabPagoRucProveedor
              );
            }
          }
        },
        error: (error) => {
          console.error('Error al Obtener el RUC del Proveedor:', error);
        },
        complete: () => console.info('completado'),
      });
    } catch (error) {
      console.error('error en buscar proveedor por RUC: ', error);
    }
  }
  //*Actiones  
  actionEdit: string = 'edicion';
  selectEditAction(action: string) {
    this.actionEdit = action;
  }


  ////////////////////////////////////////////ENVIO DE SOLICITUD DE COTIZACION//////////////////////////////////////////

  guardarEnviarSolNueva() {
    try {
      this.generarSolicitud();
      setTimeout(() => {
        this.enviarSolicitud();
      }, 500);
      //this.sendNotify();
    } catch (error) {
      console.log('Error:', error);
      const msjError = "No se ha podido enviar la solicitud, intente nuevamente.";
      this.callMensaje(msjError, false);
    }
  }

  guardarEnviarSolEditada() {
    try {
      this.savePagoEdit();
      setTimeout(() => {
        this.enviarSolicitud();
      }, 800);
      //this.sendNotify();
    } catch (error) {
      console.log('Error:', error);
      const msjError = "No se ha podido enviar la solicitud, intente nuevamente.";
      this.callMensaje(msjError, false);
    }
  }

  guardarDevolverSolEditada() {
    this.devolucion = true;
    try {
      //this.saveEdit();
      let motivoDevolucion = '';
      let aprobPresp = '';
      if (this.devolucion) {
        motivoDevolucion = this.motivoDevEditar;
        aprobPresp = 'NO';
      } else {
        motivoDevolucion = 'NOHAYMOTIVO';
        aprobPresp = 'SI';
      }

      this.cabPagoService.updateMotivoDevolucion(this.trTipoSolicitud, this.noSolTmp, motivoDevolucion).subscribe(
        (response) => {
          //console.log("Motivo de devolucion actualizado");
        },
        (error) => {
          console.log('Error al actualizar el motivo de devolucion: ', error);
        }
      );
      setTimeout(() => {
        this.noAutorizar();
      }, 500);
    } catch (error) {
      console.log('Error:', error);
      const msjError = "No se ha podido devolver la solicitud, intente nuevamente.";
      this.callMensaje(msjError, false)
    }
  }

  noSolTmp: number = 0;//asegurarse que el numero de solicitud actual de la cabecera este llegando aqui
  estadoTrkTmp: number = 10;//asegurarse que el estado actual de la cabecera este llegando aqui
  depSolTmp: number = 0;//asegurarse que el area actual de la cabecera este llegando aqui
  areaSolTmp: number = 0;//asegurarse que el area actual de la cabecera este llegando aqui


  aprobadopor: string = 'XXXXXX';
  financieropor: string = 'XXXXXX';
  // Método que cambia el estado del tracking de la solicitud ingresada como parámetro al siguiente nivel
  async enviarSolicitud() {
    //console.log("setDestino", this.setDestino);
    this.devolucion = false;

    let motivoDevolucion = 'NOHAYMOTIVO';
    let aprobPresp = '';
    if (this.devolucion) {
      motivoDevolucion = this.motivoDevEditar;
      aprobPresp = 'NO';
    } else {
      motivoDevolucion = 'NOHAYMOTIVO';
      aprobPresp = 'SI';
    }

    this.cabPagoService.updateMotivoDevolucion(this.trTipoSolicitud, this.noSolTmp, motivoDevolucion).subscribe(
      (response) => {
        //console.log("Motivo de devolucion actualizado");
      },
      (error) => {
        console.log('Error al actualizar el motivo de devolucion: ', error);
      }
    );
    //verifica los niveles de aprobacion y financiero para asignar el usuario que envia la solicitud para guardar el empleado quien autoriza
    if (this.estadoTrkTmp == 40) {
      this.aprobadopor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setAprobadoPor(this.aprobadopor);
    } /*else if (this.estadoTrkTmp == 60) {
      this.financieropor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setFinancieroPor(this.financieropor);
    } */

    await this.getNivelRuteoArea();
    try {
      // Espera a que se complete getNivelRuteoArea
      let newEstado: number = 0;
      let indiceNewEstado: number = 0;
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
          this.cabPagoService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'F').subscribe(
            (response) => {
              this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 0, this.cookieService.get('userIdNomina'), 'Finalizado').subscribe(
                (response) => {

                  this.showmsj = true;
                  const msjExito = `La solicitud ha sido enviada exitosamente.`;
                  this.callMensaje(msjExito, true);

                  /*this.solTimeService.saveSolTime(
                    this.trTipoSolicitud,
                    this.noSolTmp,
                    this.cookieService.get('userIdNomina'),
                    this.cookieService.get('userName'),
                    0,
                    'Finalizado'
                  );*/

                  setTimeout(() => {
                    this.clear();
                    this.serviceGlobal.solView = 'crear';
                    this.serviceGlobal.tipoSolBsq = 3;
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
            indiceNewEstado = i;
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
          this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado, this.cookieService.get('userIdNomina'), 'Envío').subscribe(
            (response) => {
              console.log("Solicitud enviada");

              /*this.solTimeService.saveSolTime(
                this.trTipoSolicitud,
                this.noSolTmp,
                this.cookieService.get('userIdNomina'),
                this.cookieService.get('userName'),
                newEstado,
                'Envío'
              );*/


              const msjExito = `La solicitud ha sido enviada exitosamente.`;
              this.callMensaje(msjExito, true);
              //LLAMA AL METODO DE ENVIAR CORREO Y LE ENVIA EL SIGUIENTE NIVEL DE RUTEO
              this.getMailContentSN(10, newEstado, newestadoSt);

              setTimeout(() => {
                this.clear();
                this.serviceGlobal.solView = 'crear';
                this.serviceGlobal.tipoSolBsq = 3;
                this.router.navigate(['allrequest']);
              }, 3000);
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
            }
          );

          //si el estado nuevo es mayor al 40, actualizar la fecha
          if (this.nivelSolAsignado[indiceNewEstado].rutareaNivel == 40) {
            this.cabPagoService.updateFechaPago(this.trTipoSolicitud, this.noSolTmp, new Date()).subscribe(
              (response) => {
                //console.log("Fecha de aprobacion actualizada");
              },
              (error) => {
                console.log('Error al actualizar la fecha de aprobacion: ', error);
              }
            );
          }
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
    await this.solve();
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

  async solve() {
    this.nivelRut$ = this.nivRuteService.getNivelruteo().pipe(
      map(niv => niv.sort((a, b) => a.nivel - b.nivel))
    );
  }
  ///////////////////////////////////////////DOCUMENTACION DE CREACION DE PAGO/////////////////////////////////////////


  actionCreate: string = 'creacion';

  selectCreateAction(action: string) {
    this.actionCreate = action;
  }


  ///////////////////////////////////////////ANULACION DE SOLICITUD///////////////////////////////////////////////////

  anularSolicitud() {
    let exito: boolean = false;
    let exitotrk: boolean = false;
    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabPagoIdEmisor).subscribe(
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
      this.cabPagoService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'C').subscribe(
        (response) => {
          //console.log('Estado actualizado exitosamente');
          exito = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exito = false;
        }
      );

      this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 9999, this.cookieService.get('userIdNomina'), 'Anulación').subscribe(
        (response) => {
          //console.log('Estado de tracknig actualizado exitosamente');

          /*this.solTimeService.saveSolTime(
            this.trTipoSolicitud,
            this.noSolTmp,
            this.cookieService.get('userIdNomina'),
            this.cookieService.get('userName'),
            9999,
            'Anulación'
          );*/

          exitotrk = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exitotrk = false;
        }
      );
      setTimeout(() => {

        if (exito && exitotrk) {
          const msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido anulada exitosamente.`;
          this.callMensaje(msjExito, true);

          //notificar al emisor de la solicitud que ha sido anulada
          this.getMailContentSM(30, mailToNotify);

          setTimeout(() => {
            this.showmsj = false;
            this.msjExito = '';
            this.clear();
            this.serviceGlobal.solView = 'crear';
            this.router.navigate(['allrequest']);
          }, 3000);
        }
      }, 1000);

    } catch (error) {
      console.log('Error:', error);
      const msjError = "No se ha podido anular la solicitud, intente nuevamente.";
      this.callMensaje(msjError, false);
    }

  }
  ///////////////////////////////////////////NO AUTORIZAR SOLICITUD///////////////////////////////////////////////////

  async noAutorizar() {
    await this.getNivelRuteoArea();
    console.log("Niveles de ruteo asignados: ", this.nivelRuteotoAut);

    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabPagoIdEmisor).subscribe(
      (response: any) => {
        //console.log('Empleado: ', response);
        mailToNotify = response[0].empleadoCorreo;
        console.log("Correo enviado a: ", mailToNotify)

        //proceder con la devolucion unicamente si se ha encontrado el correo del empleado
        if (this.areaSolTmp == 12) {
          for (let i = 0; i < this.nivelRuteotoAut.length; i++) {
            let niv = this.nivelRuteotoAut[i];
            if (niv.rutareaNivel == this.estadoTrkTmp) {
              let newEstado = this.nivelRuteotoAut[i - 1].rutareaNivel;
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

              this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado, this.cookieService.get('userIdNomina'), 'Devolución').subscribe(
                (response) => {
                  //console.log('Estado de tracknig actualizado exitosamente');
                  const msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido devuelta al nivel anterior.`;
                  this.callMensaje(msjExito, true)

                  /*this.solTimeService.saveSolTime(
                    this.trTipoSolicitud,
                    this.noSolTmp,
                    this.cookieService.get('userIdNomina'),
                    this.cookieService.get('userName'),
                    newEstado,
                    'Devolución'
                  );*/

                  if (newEstado == 10) {
                    //extraer el contenido del email correspondiente
                    this.getMailContentSM(20, mailToNotify);

                  } else {
                    //extraer el contenido del email correspondiente
                    this.getMailContentSN(21, newEstado, newestadoSt);
                  }

                  setTimeout(() => {
                    this.showmsj = false;
                    this.msjExito = '';
                    this.clear();
                    this.serviceGlobal.solView = 'crear';
                    this.router.navigate(['allrequest']);
                  }, 3000);
                },
                (error) => {
                  console.log('Error al actualizar el estado: ', error);
                  const msjError = "No se ha podido devolver la solicitud, intente nuevamente.";
                  this.callMensaje(msjError, false);
                }
              );

              //console.log("Nuevo estado: ", newEstado);
              break;
            }

          }
        } else {
          //regresar la solicitud al nivel 10 y notificar a todos los niveles anteriores
          this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 10, this.cookieService.get('userIdNomina'), 'Devolución').subscribe(
            (response) => {
              //console.log('Estado de tracknig actualizado exitosamente');

              /*this.solTimeService.saveSolTime(
                this.trTipoSolicitud,
                this.noSolTmp,
                this.cookieService.get('userIdNomina'),
                this.cookieService.get('userName'),
                10,
                'Devolución'
              );*/

              const msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido devuelta al nivel inicial.`;
              this.callMensaje(msjExito, true)

              this.getMailContentSM(20, mailToNotify);

              //recorrer los niveles inferiores a estadoTrkTmp y enviar correo a todos ellos
              setTimeout(() => {

                for (let i = 0; i < this.nivelRuteotoAut.length; i++) {
                  let niv = this.nivelRuteotoAut[i];
                  if (niv.rutareaNivel < this.estadoTrkTmp && niv.rutareaNivel != 10) {
                    this.getMailContentSN(22, niv.rutareaNivel, 'E');
                  }
                }
              }, 300);


              setTimeout(() => {
                this.clear();
                this.serviceGlobal.solView = 'crear';
                this.router.navigate(['allrequest']);
              }, 3000);
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
              const msjError = "No se ha podido devolver la solicitud, intente nuevamente.";
              this.callMensaje(msjError, false);
            }
          );
        }
      },
      (error) => {
        console.log('Error al obtener el empleado: ', error);
      }
    );




  }

  ////////////////////////////////////NOTIFICACION AL SIGUIENTE NIVEL/////////////////////////////////////////////////

  async sendNotify(nivelStr: number, nivelStatus: string) {
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
              //buscar el correo del empleado y setear su correo en la variable mailtonotify
              this.empService.getEmpleadoByNomina(emp.empNivEmpelado).subscribe(
                (response: any) => {
                  //console.log('Empleado: ', response);
                  mailToNotify = response[0].empleadoCorreo;
                  //enviar la notificacion al correo guardado en mailnotify
                  this.sendMail(mailToNotify);
                  console.log("Correo enviado a: ", mailToNotify)
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

  sendMail(mailToNotify: string) {
    let contenidoMail = this.mailContent.emailContContenido;
    let asuntoMail = this.mailContent.emailContAsunto;

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
          console.log(`Error, no se ha podido enviar el correo al empleado correspondiente.`, error)
          const msjError = `Error, no se ha podido enviar el correo al empleado correspondiente, intente nuevamente.`;
          this.callMensaje(msjError, false)
        }
      );
    }, 500);
  }



  mailContent: any;
  setMailInfo() {
    //sustituir las palabras tiposol por la variable this.tipoSolicitudEmail, nivelproceso por this.nivelProcesoEmail y numsol por this.numeroSolicitudEmail de la propiedad emailContContenido del objeto mailContent
    let asuntoMail = this.mailContent.emailContAsunto;
    let contenidoMail = this.mailContent.emailContContenido;
    asuntoMail = asuntoMail.replace('tiposol', this.tipoSolicitudEmail);
    contenidoMail = contenidoMail.replace('tiposol', this.tipoSolicitudEmail);
    contenidoMail = contenidoMail.replace('nivelproceso', this.nivelProcesoEmail);
    contenidoMail = contenidoMail.replace('numsol', this.numeroSolicitudEmail);

    this.mailContent.emailContAsunto = asuntoMail;
    this.mailContent.emailContContenido = contenidoMail;
  }

  //CORREGIR LAS LLAMADAS A LOS METODOS PARA ENVIAR MAILS
  //obtiene el contenido deo correo y llama al metodo sendnotify
  getMailContentSN(idMail: number, nivel: number, typeProceso: string) {
    this.sendMailService.getMailContent(idMail).subscribe(
      response => {
        this.mailContent = response;
        this.setMailInfo();
        //enviar el mail 
        this.sendNotify(nivel, typeProceso);
      },
      error => {
        console.log(`Error, no se ha podido obtener el contenido de los correos.`, error)
      }
    );
  }


  //obtiene el contenido del correo y llama al metodo sendmail
  getMailContentSM(idMail: number, mailToNotify: string) {

    this.sendMailService.getMailContent(idMail).subscribe(
      response => {
        this.mailContent = response;
        this.setMailInfo();
        //enviar el mail 
        this.sendMail(mailToNotify);
      },
      error => {
        console.log(`Error, no se ha podido obtener el contenido de los correos.`, error)
      }
    );
  }


  setAprobadoPor(id: string) {
    this.cabPagoService.updateAprobadoCotizacion(this.trTipoSolicitud, this.noSolTmp, id).subscribe(
      (response) => {
        console.log('ACTUALIZADO CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

  /* setFinancieroPor(id: number){
     this.cabPagoService.updateFinancieroCotizacion(this.trTipoSolicitud, this.noSolTmp,id).subscribe(
       (response) => {
         console.log('ACTUALIZADO CORRECTAMENTE');
       },
       (error) => {
         console.log('error : ', error);
       }
     );
   }*/

  ///////////////////////////////////////////CANCELACION DE ORDEN///////////////////////////////////////////////////

  showCancelacion: boolean = false;

  setCancelacionOrden(valor: string) {
    if (valor == 'TTL') {
      this.showCancelacion = false;
    } else if (valor == 'PCL') {
      this.showCancelacion = true;
    }
  }

  calculateSubtotal(id: number) {
    for (let detalle of this.detalleSolPagos) {
      if (detalle.idDetalle == id) {
        detalle.subTotal = detalle.cantidadRecibid * detalle.valorUnitario;
      }
    }
  }

  calculateSubtotalEdit(id: number) {
    for (let detalle of this.detallePago) {
      if (detalle.detPagoIdDetalle == id) {
        detalle.detPagoSubtotal = detalle.detPagoCantRecibida * detalle.detPagoValUnitario;
      }
    }
  }
  FechaMaxEntrega(fechas: string) {
    let fecha = new Date(fechas);
    fecha.setMonth(fecha.getMonth() + 6)
    let Fechatrans = this.formatDateToYYYYMMDD(fecha)
    return Fechatrans
    // return fechaMax;
  }

  showMotivoDev: boolean = false;
  enableMotivoDev() {
    this.showMotivoDev = !this.showMotivoDev;
  }



  //totalFacturas: number = 0;
  //AGREGA UNA FACTURA A LA LISTA DE FACTURAS QUE LUEGO SE ENVIARAN A LA API
  addFactura() {
    const facturaExistente = this.facturasList.find(factura => factura.numero === this.factura.numero);

    if (facturaExistente) {
      console.log('Ya existe una factura con el mismo número.');

      //sobreescribir los datos de la factura existente con los datos de this.factura
      facturaExistente.numero = this.factura.numero;
      facturaExistente.fecha = this.factura.fecha;
      facturaExistente.proveedor = this.factura.proveedor;
      facturaExistente.provRuc = this.factura.provRuc;
      facturaExistente.ordCompra = this.factura.ordCompra;
      facturaExistente.valorTotal = this.factura.valorTotal;
      facturaExistente.new = this.factura.new;
      facturaExistente.detalles = _.cloneDeep(this.detallesTmpforEdit);

    } else {

      let detallestmp: DetalleFactura[] = [];

      if (this.checkTotal == true) {
        detallestmp = this.factura.detalles;
      } else {
        detallestmp = this.detallesTmpforEdit;
      }

      const nuevaFactura: Factura = {
        numero: this.factura.numero,
        fecha: this.factura.fecha,
        proveedor: this.factura.proveedor,
        provRuc: this.factura.provRuc,
        ordCompra: this.factura.ordCompra,
        valorTotal: this.factura.valorTotal,
        detalles: detallestmp,
        new: true
      };

      // Agregar la nueva factura a la lista
      this.facturasList.push(nuevaFactura);

      //actualiza los datos de la lista default segun las facturas creadas
      this.updateOCvalues();
    }

    setTimeout(() => {
      //recorrer la lista de facturas y sumar todos los valores totales
      this.sumTotalFacturas();

      // Limpiar la cabecera del objeto factura
      this.clearFactura();
      this.checkTotal = false;
      this.showVerifyTotal = false;

    }, 300);
    console.log('Lista de facturas: ', this.facturasList);
    console.log('lista de orden de compra: ', this.detalleFactDefault);
    this.verifyTotal();

  }

  sumTotalFacturas() {
    let totalFacturas = 0;
    this.facturasList.forEach(factura => totalFacturas = totalFacturas + factura.valorTotal);



    if (this.changeview == 'crear') {
      this.cab_totalautorizado = totalFacturas;
      //console.log("total autorizado: ", this.cab_totalautorizado);
    } else if (this.changeview == 'editar') {
      this.cabecera.cabPagoValorTotalAut = totalFacturas;
      //console.log("total autorizado: ", this.cabecera.cabPagoValorTotalAut);
    }
  }

  clearFactura() {
    // Limpiar la cabecera del objeto factura
    this.factura = {
      numero: '',
      fecha: new Date(),
      proveedor: this.cab_proveedor,
      provRuc: this.cab_rucproveedor,
      ordCompra: this.factura.ordCompra,
      valorTotal: 0,
      detalles: _.cloneDeep(this.detalleFactDefault),
      new: false
    };
  }

  cancelarFactura() {
    this.detError = false;
    this.checkTotal = false;
    this.showVerifyTotal = false;

    // Buscar el índice del elemento en la lista
    const index = this.facturasList.findIndex(factura => factura.numero === this.factura.numero);

    if (index !== -1) {

      this.facturasList[index].numero = _.cloneDeep(this.factura.numero);
      this.facturasList[index].fecha = _.cloneDeep(this.factura.fecha);
      // Sobrescribir el contenido del elemento en la lista con los valores de this.facturaTMP
      //this.facturasList[index] = Object.assign({}, this.facturaTMP);
      //this.facturasList[index] = _.cloneDeep(this.facturaTMP);

      //setear las propiedades de this.facturasList[index] con los valores de this.facturaTMP excepto el numero
      /*this.facturasList[index].fecha = _.cloneDeep(this.facturaTMP.fecha);
      this.facturasList[index].proveedor = _.cloneDeep(this.facturaTMP.proveedor);
      this.facturasList[index].provRuc = _.cloneDeep(this.facturaTMP.provRuc);
      this.facturasList[index].ordCompra = _.cloneDeep(this.facturaTMP.ordCompra);
      this.facturasList[index].valorTotal = _.cloneDeep(this.facturaTMP.valorTotal);
      this.facturasList[index].detalles = _.cloneDeep(this.detallesTmpforEdit);*/


    }

    setTimeout(() => {
      this.clearFactura();
    }, 100);
  }

  deleteDetalleFactura(id: number) {
    this.factura.detalles.splice(id, 1);
    this.sumTotalFacturas();
  }

  facDlt!: Factura;
  selectFacturaID(factura: Factura) {
    this.facDlt = factura;
  }

  deleteFactura() {
    this.recoverOcValues(this.facDlt);


    this.verifyTotal();
    //extraer el index de this.facIdDlt de la lista this.facturasList
    const index = this.facturasList.findIndex(factura => factura === this.facDlt);
    this.facturasList.splice(index, 1);
    this.sumTotalFacturas();

  }

  setProveedorFactura() {
    this.showDltFactBTN = true;
    this.showVerifyTotal = true;
    this.factura.proveedor = this.cabecera.cabPagoProveedor;
    this.factura.provRuc = this.cabecera.cabPagoRucProveedor;
    this.factura.ordCompra = this.cabecera.cabPagoNoSolOC;
    console.log("this.factura:", this.factura);
  }

  activeVerifyBtn() {
    this.showDltFactBTN = true; 
    this.showVerifyTotal = true;
    this.showVerifyTotal = true;
    console.log("detalles default de select factura", this.detalleFactDefault)
  }

  /////////////////////////////////////////////SELECCIONA EL TIPO DE DESCUENTO A APLICAR//////////////////////////////////////
  tipoDescuentoFact: string = 'cash';
  $prefix: string = '$';
  x100prefix: string = '';

  x100change() {
    if (this.tipoDescuentoFact == 'x100') {
      this.$prefix = '';
      this.x100prefix = '%';
    } else if (this.tipoDescuentoFact == 'cash') {
      this.$prefix = '$';
      this.x100prefix = '';
    }
  }

  ////////////////////////VERIFICA QUE LOS VALORES DE A FACTURA NO SOBREPASEN A LOS DE LA ORDEN DE COMPRA////////////////////////
  detError: boolean = false;
  detExito: boolean = false;
  erroresDet: { mensaje: string }[] = [];
  checkTotal: boolean = false;
  showVerifyTotal: boolean = false;

  verifyTotal() {//suma los totales de las facturas y define si se muestra o no el boton de comfirma y de agregar una nueva factura

    //console.log("verificando el total de la orden de compra")
    let sumaCantidades = 0;
    for (let detalle of this.detalleFactDefault) {
      sumaCantidades = sumaCantidades + detalle.cantidad;
    }

    if (sumaCantidades == 0) {
      //console.log("la suma es 0")
      this.showVerifyTotal = false;
      this.showNewFactBTN = false;
      //this.detError = true;
      //this.erroresDet.push({ mensaje: `Todos los items de la orden de compra ya han sido registrados, no existen valores pendientes de pago.` });
    } else {
      this.showNewFactBTN = true;
    }
  }


  verificarMontoFactura() {
    this.detError = false;
    this.erroresDet = [];
    this.checkTotal = false;

    //verificar si la suma de las cantidades de los detalles de la lista default es cero
    if (this.showVerifyTotal == false) {
      //saltar todas las validaciones y habilitar el boton confirmar
      this.checkTotal = true;
      this.detExito = true;
      setTimeout(() => {
        this.detExito = false;
      }, 3000);

    } else {

      //recorrer la lista this.factura.detalles y verificar si la cantidad de cada detalle es igual o menor a la cantidad del mismo detalle de la lista detalleFactDefault
      for (let detalle of this.factura.detalles) {
        for (let detalleDefault of this.detalleFactDefault) {
          if ((detalle.descProd == detalleDefault.descProd) && (detalle.itemProd == detalleDefault.itemProd)) {//encuentra los items que sean iguales
            if (detalle.cantidad > detalleDefault.cantidad) {
              console.log("item: ", detalle.descProd, ", no coincide en la cantidad");
              detalle.checkC = false;//setea como false el check que verifica si la cantidad es correcta

              this.detError = true;
              this.erroresDet.push({ mensaje: `El item "${detalle.descProd}" no coincide en la cantidad autorizada. Cantidad autorizada: ${detalleDefault.cantidad}.` });

            } else {
              detalle.checkC = true;//setea como true el check que verifica si la cantidad es correcta
            }
          }
        }
      }

      //recorrer la lista this.factura.detalles y verificar si el subtotal de cada detalle es igual o menos a al subtotal del mismo detalle de la lista detalleFactDefault
      for (let detalle of this.factura.detalles) {
        for (let detalleDefault of this.detalleFactDefault) {
          if ((detalle.descProd == detalleDefault.descProd) && (detalle.itemProd == detalleDefault.itemProd)) {//encuentra los items que sean iguales
            if (detalle.subTotal > detalleDefault.subTotal) {
              console.log("item: ", detalle.descProd, ", no coincide en el subtotal");
              detalle.checkS = false;//setea como false el check que verifica si el subtotal es correcto

              this.detError = true;
              this.erroresDet.push({ mensaje: `El item "${detalle.descProd}" no coincide en el subtotal autorizado. Subtotal autorizado: ${detalleDefault.subTotal}.` });

            } else {
              detalle.checkS = true;//setea como true el check que verifica si el subtotal es correcto
            }
          }
        }
      }

      //recorrer la lista this.factura.detalles y sumar todos los subtotales
      let totalFactura = 0;
      for (let detalle of this.factura.detalles) {
        totalFactura = totalFactura + detalle.subTotal;
      }
      this.factura.valorTotal = totalFactura;

      //evaluar si todos los checks de cantidad y subtotal son true
      for (let detalle of this.factura.detalles) {
        if (detalle.checkC && detalle.checkS) {
          this.checkTotal = true;
        } else {
          this.checkTotal = false;
          break;
        }
      }

      if (this.factura.numero == '') {
        this.checkTotal = false;
      }

      if (this.factura.valorTotal == 0) {
        this.checkTotal = false;

        this.detError = true;
        this.erroresDet.push({ mensaje: `El valor total de la factura no puede ser cero.` });

      } else if (totalFactura != this.factura.valorTotal) {
        this.checkTotal = false;

        this.detError = true;
        this.erroresDet.push({ mensaje: `El valor total de los items no coincide con el valor total de la factura.` });
      } else {
        this.checkTotal = true;

        this.detExito = true;
        setTimeout(() => {
          this.detExito = false;
        }, 3000);
      }
    }



  }

  /////////////////////////////////////////////////CALCULOS DE DESCUENTOS Y SUBTOTAL//////////////////////////////////////////////
  calculateSubtotalDet(det: DetalleFactura) {
    if (this.tipoDescuentoFact == 'cash') {
      det.subTotal = det.cantidad * det.valorUnitario;
      det.subTotal = det.subTotal - det.descuento;
    } else if (this.tipoDescuentoFact == 'x100') {
      det.subTotal = det.cantidad * det.valorUnitario;
      det.subTotal = det.subTotal - (det.subTotal * (det.descuento / 100));
    }
  }


  ////////////////////////////////////////////////////ENVIO DE LISTAS A LA API//////////////////////////////////////////
  //envio de la lista de facturas
  saveFacturas(nombre: string) {
    let numOrdenPago = nombre;
    let errorFactList: any[] = [];

    let tipoSol, noSol = 0;

    if (this.changeview == 'crear') {
      tipoSol = this.responseTRK.solTrTipoSol;
      noSol = this.responseTRK.solTrNumSol;
    } else if (this.changeview == 'editar') {
      tipoSol = this.cabecera.cabPagoTipoSolicitud;
      noSol = this.cabecera.cabPagoNoSolicitud;
    }

    // Recorrer la lista de facturas y enviarlas a la API
    let iFactura = 1;
    for (let factura of this.facturasList) {
      if (factura.new == true) {
        // Crear el objeto de datos para la factura actual
        const dataFactura = {
          factSpTipoSol: tipoSol,
          factSpNoSol: noSol,
          factSpNoFactura: iFactura,
          factSpNumFactura: factura.numero,
          factSpFechaFactura: factura.fecha,
          factSpProvFactura: factura.proveedor,
          factSpRucProvFactura: factura.provRuc,
          factSpNumOrdenCompra: factura.ordCompra,
          factSpMontoFactura: factura.valorTotal,
          factSpEstado: 1
        };

        // Enviar la solicitud a la API
        this.facturasService.addFacturaPago(dataFactura).subscribe(
          (response: any) => {
            console.log("Factura creada exitosamente", response);
            //this.callMensaje(`La factura N° ${factura.numero} se guardó exitosamente.`, true);

            const idFactura = response.factSpId;

            let iDetalle = 1;
            // Recorrer la lista de detalles de la factura actual
            for (let detalle of factura.detalles) {

              const detalleData = {
                detFactIdFactura: idFactura,
                detFactNoDetalle: iDetalle,
                detFactNumOrdenCompra: factura.ordCompra,
                detFactIdProducto: detalle.itemProd,
                detFactDescpProducto: detalle.descProd,
                detFactCantProducto: detalle.cantidad,
                detFactValorUnit: detalle.valorUnitario,
                detFactDescuento: detalle.descuento,
                detFactTotal: detalle.subTotal,
                detFactEstado: 1
              };

              // enviar el detalle a la api
              this.facturasService.addDetallePago(detalleData).subscribe(
                (response) => {
                  console.log("Detalle de factura creado exitosamente");

                  //this.callMensaje(`El detalle del producto "${detalle.descProd}" se guardó exitosamente.`, true);
                },
                (error) => {
                  console.log('Error al crear el detalle de la factura: ', error);
                  this.correctSave = false;
                  this.errors.push(error.error.message);
                }
              );
              iDetalle++;
            }
          },
          (error) => {
            console.log('Error al crear la factura: ', error);
            this.correctSave = false;
            this.errors.push(error.error.message);
          }
        );
        iFactura++;
      }

    }
  }


  saveEditFacturas(nombre: string) {
    let numOrdenPago = nombre;

    // Recorrer la lista de facturas y enviarlas a la API
    let iFactura = 1;
    for (let factura of this.facturasList) {
      if (factura.new == false) {

        // Crear el objeto de datos para la factura actual
        const dataFactura = {
          factSpId: factura.idFactura,
          factSpTipoSol: this.cabecera.cabPagoTipoSolicitud,
          factSpNoSol: this.cabecera.cabPagoNoSolicitud,
          factSpNoFactura: factura.noFactura,
          factSpNumFactura: factura.numero,
          factSpFechaFactura: factura.fecha,
          factSpProvFactura: factura.proveedor,
          factSpRucProvFactura: factura.provRuc,
          factSpNumOrdenCompra: factura.ordCompra,
          factSpMontoFactura: factura.valorTotal,
          factSpEstado: 1
        };

        // Enviar la solicitud a la API
        console.log("factura nueva: ", dataFactura)
        this.facturasService.updateFacturaPago(factura.noSol, factura.noFactura, dataFactura).subscribe(
          (response: any) => {
            console.log("Factura editada exitosamente", response);
            //this.callMensaje(`La factura N° ${factura.numero} se guardó exitosamente.`, true);

            //const idFactura = response.factSpId;


            //let iDetalle = 1;
            // Recorrer la lista de detalles de la factura actual
            for (let detalle of factura.detalles) {

              const detalleData = {
                detFactId: detalle.idDetalle,
                detFactIdFactura: factura.idFactura,
                detFactNoDetalle: detalle.noDetalle,
                detFactNumOrdenCompra: factura.ordCompra,
                detFactIdProducto: detalle.itemProd,
                detFactDescpProducto: detalle.descProd,
                detFactCantProducto: detalle.cantidad,
                detFactValorUnit: detalle.valorUnitario,
                detFactDescuento: detalle.descuento,
                detFactTotal: detalle.subTotal,
                detFactEstado: 1
              };

              // enviar el detalle a la api
              //idFactura: det.detFactIdFactura, //guarda el id de la fcatura al que pertenece el detalle
              //noDetalle: det.detFactNoDetalle, //guarda el numero de detalle de la factura
              this.facturasService.updateDetalleFactura(detalle.idFactura, detalle.noDetalle, detalleData).subscribe(
                (response) => {
                  console.log("Detalle de factura editado exitosamente");

                  //this.callMensaje(`El detalle del producto "${detalle.descProd}" se guardó exitosamente.`, true);
                },
                (error) => {
                  console.log('Error al editar el detalle de la factura: ', error);
                  this.correctSave = false;
                  this.errors.push(error.error.message);
                }
              );
              //iDetalle++;
            }
          },
          (error) => {
            console.log('Error al editar la factura: ', error);
            this.correctSave = false;
            this.errors.push(error.error.message);
          }
        );
        //iFactura++;
      }
    }


  }

  //eliminar la factura en la vista de edicion
  factDltEdit!: Factura;
  selectFacturaIDEdit(fact: Factura) {
    this.factDltEdit = fact;
    console.log("factura a eliminar: ", this.factDltEdit);
  }

  //elimina la factura de la lista de facturas y cambia el estado de la factura a 0 para que no vuelva a aparecer
  deleteFacturaEdit() {
    //devuelve los valores de la factura a la lista default
    this.recoverOcValues(this.factDltEdit);

    setTimeout(() => {
      //guarda los cambios de la lista default en la base de datos
      this.saveOCValues();
    }, 200);

    //buscar el index del objeto factura en la lista de facturas
    const index = this.facturasList.findIndex(factura => factura === this.factDltEdit);
    //elimina la factura de la lista de facturas
    this.facturasList.splice(index, 1);
    //realiza la suma para obtener el valor total y setearlo en la cabecera de la orden de pago
    this.sumTotalFacturas();

    //cambiar estado de la factura a 0
    this.facturasService.changeEstadoFactura(this.factDltEdit.noSol, this.factDltEdit.numero, 0).subscribe(
      (response) => {
        console.log("Estado de factura cambiado exitosamente");
        this.callMensaje(`La factura N° ${this.factDltEdit.numero} ha sido eliminada exitosamente.`, true);
      },
      (error) => {
        console.log('Error al cambiar el estado de la factura: ', error);
      }
    );

    this.factDltEdit = {
      idFactura: 0,
      noSol: 0,
      noFactura: 0,
      numero: '',
      fecha: new Date(),
      proveedor: '',
      provRuc: '',
      ordCompra: this.factDltEdit.ordCompra,
      valorTotal: 0,
      detalles: [],
      new: false
    };
    //this.showNewFactBTN = true;
    this.verifyTotal();
  }


  //actualizacion de los registros de la orden de compra consultada
  updateOCvalues() {
    console.log("ACTUALIZANDO VALORES DE LA ORDEN DE COMPRA")
    //for (let factura of this.facturasList) {
    //console.log("factura que se va descontar: ", factura);
    for (let detalle of this.factura.detalles) {
      for (let detalleDefault of this.detalleFactDefault) {
        if ((this.factura.ordCompra === detalleDefault.ordenCompra) && (detalle.itemProd == detalleDefault.itemProd) && (detalle.descProd == detalleDefault.descProd) && detalleDefault.cantidad > 0) {
          //console.log("detalle que se va a descontar: ", detalleDefault);
          /*const difCantidad = detalleDefault.cantidad - detalle.cantidad;
          const difSubtotal = detalleDefault.subTotal - detalle.subTotal;
          
          detalleDefault.cantidad = detalleDefault.cantidad - difCantidad;
          detalleDefault.subTotal = detalleDefault.subTotal - difSubtotal;*/

          //calcula el resto de la cantidad y el subtotal que quedan pendiente de pago
          detalleDefault.cantidad = detalleDefault.cantidad - detalle.cantidad;
          detalleDefault.subTotal = detalleDefault.subTotal - detalle.subTotal;
        }
      }
    }
    //}
  }

  recoverOcValues(factura: Factura) {
    for (let detalle of factura.detalles) {
      for (let detalleDefault of this.detalleFactDefault) {
        if ((factura.ordCompra === detalleDefault.ordenCompra) && (detalle.itemProd == detalleDefault.itemProd) && (detalle.descProd == detalleDefault.descProd)) {
          //calcula el resto de la cantidad y el subtotal que quedan pendiente de pago
          detalleDefault.cantidad = detalleDefault.cantidad + detalle.cantidad;
          detalleDefault.subTotal = detalleDefault.subTotal + detalle.subTotal;
        }
      }
    }

    //se asegura que los detalles de las facturas por defecto se guarden en el objeto this.factura.detalles
    this.factura.detalles = _.cloneDeep(this.detalleFactDefault);
  }

  saveOCValues() {
    //enviar la lista de detalles default a la api
    //console.log("lista de detalles default: ", this.detalleFactDefault);
    for (let detalle of this.detalleFactDefault) {
      const detalleData = {
        //id: detalle.id,
        detOrden: detalle.ordenCompra,
        detcodProducto: detalle.itemProd,
        detdesProducto: detalle.descProd,
        detcantidad: detalle.cantidad,
        detprecio: detalle.valorUnitario,
        detTotal: detalle.subTotal,
        detEstadoOC: 1
      }

      //console.log("detalle a enviar: ", detalleData);
      this.facturasService.postOCTemplateAX(detalleData).subscribe(
        (response) => {
          console.log("Detalle de OC actualizado exitosamente");
        },
        (error) => {
          console.log('Error al actualizar el detalle de la OC: ', error);
        }
      );
    }
  }

  updateCabeceraFact() {
    //actualizar los valores del elemento de la lista facturasList que tenga el mismo numero de factura que this.factura
    const index = this.facturasList.findIndex(factura => factura === this.factura);

    if (index !== -1) {
      // Sobrescribir el contenido del elemento en la lista con los valores de this.factura
      this.facturasList[index].numero = this.factura.numero;
      //console.log("numero de factura actualizada: ", this.facturasList[index].numero);
      //this.facturasList[index].fecha = this.factura.fecha;
    }
  }

   //verifica si el usuario esta habilitado para autorizar las solicitudes segun su maximo nivel de rol
   checkAprovePermission(): boolean{
    const maxRolNivel = this.cookieService.get('userRolNiveles').split(',').map(Number).reduce((a, b) => Math.max(a, b));

    if(maxRolNivel >= 50){
      return true
    } else if (this.areaSolTmp == this.areaUserCookieId){
      return true
    } else {
      return false
    }
  }
}

