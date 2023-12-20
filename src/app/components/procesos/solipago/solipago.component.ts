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

interface Factura {
  numero: string;
  fecha: Date;
  proveedor: string;
  provRuc: string;
  ordCompra: string;
  valorTotal: number;
  detalles: DetalleFactura[];
}

interface DetalleFactura {
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
  cabecera: any;
  detalles: any[];
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
    detalles: [] 
  };

  //almacena los detalles de una factura que se registra en el momento
  detalleFacturaList: DetalleFactura[] = [];

  //almacena los detalles de una factura que se registra en el momento sin modificaciones
  detalleFactDefault: DetalleFactura[] = [];

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
    private serviceGlobal: GlobalService,
    private cookieService: CookieService,
    private ruteoService: RuteoAreaService,
    private sendMailService: SendEmailService,
    private nivGerenciaService: NivGerenciaService,
    private sharedService: SharedService,
    private dialogService: DialogServiceService
  ) {

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
  }


  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  getLastSol(): Promise<number> {
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
  }
  //
  guardarTrancking(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.trLastNoSol = await this.getLastSol();
        this.noSolTmp = this.trLastNoSol;

        const dataTRK = {
          solTrTipoSol: this.trTipoSolicitud,
          solTrNumSol: this.trLastNoSol,
          solTrNivel: this.trNivelEmision,
          solTrIdEmisor: this.cookieService.get('userIdNomina'),
        };

        console.log('1. guardando tracking: ', dataTRK);
        this.solTrckService.generateTracking(dataTRK).subscribe(
          (response: any) => {

            this.responseTRK = response?.solTrTipoSol && response?.solTrNumSol ? response : { solTrTipoSol: 0, solTrNumSol: 0 };

            this.sharedNoSol = this.responseTRK.solTrNumSol;
            this.sharedTipoSol = this.responseTRK.solTrTipoSol;

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
    await this.getSolName(this.trLastNoSol);
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
      cabPagoNumFactura: this.cab_nofactura,
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
      cabPagoIfDestino: ifDestino
    };

    //enviar datos de cabecera a la API
    console.log('2. guardando solicitud...', dataCAB);
    await this.cabPagoService.addSolPag(dataCAB).subscribe(
      (response) => {
        const msjExito = 'Solicitud de Pago Generada Exitosamente';
        this.callMensaje(msjExito, true);
        this.AddDetSolPago();
        setTimeout(() => {
          this.serviceGlobal.tipoSolBsq = 3;
          this.router.navigate(['allrequest']);
        }, 3000)
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
    for (let emp of this.empleados) {
      if (emp.empleadoNombres + ' ' + emp.empleadoApellidos == this.receptor) {
        this.cab_recibe = emp.empleadoIdNomina
        //console.log("Empleado ID:",this.trIdNomEmp);
      }
    }
    for (let emp of this.empleadoEdi) {
      if (emp.empleadoNombres + ' ' + emp.empleadoApellidos == this.receptor) {
        this.cabecera.cabPagoReceptor = emp.empleadoIdNomina;
      }
    }
  }

  destinoIO: boolean = false;
  showItDt: string = 'items';

  setID(valor: string) {
    this.showItDt = valor;
  }

  getDetFromOC() {
    this.detalleSolPagos = [];
    if (this.valorinputOC == '') {
      this.callMensaje('Por favor ingrese el número de orden de compra.', false);
    } else {

      this.detPagoService.DetOrdenCompras(this.valorinputOC).subscribe(
        {
          next: data => {
            //console.log("data", data);
            if (data[0].detEstadoOC != 1) {
              this.callMensaje('Error, la orden de compra ingresada no se encuentra abierta, por favor intente con una orden abierta.', false);
            } else {

              this.detalleFacturaList = data.map((det: any) => ({
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
  
  //ESTE METODO YA NO FUNCIONARÁ
  //* Agregamos los detalles de pago a base
  AddDetSolPago() {
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
  }



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
  }
  //* Obtener los datos de cabecera de solicitud y detalle
  async getSoliPagos() {
    try {
      const data = await this.cabPagoService
        .getSolPagobyId(this.SolID)
        .toPromise();
      this.solicitudEdit = data;
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
    for (let det of this.solicitudEdit.detalles) {
      this.detallePago.push(det as DetallePago);
    }
    //ordenamiento de detalle de solicitud pago
    this.detallePago.sort((a, b) => a.detPagoIdDetalle - b.detPagoIdDetalle);

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
  lastNivel: string = '';

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
  //Guardar lo editado de  solicitud de pago
  async savePagoEdit() {
    try {
      console.log('Se guardo la edicion ');
      await this.saveEditCabeceraPago();
      await this.saveEditdetPago();
      const msjExito = `Solicitud N° ${this.cabecera.cabPagoNumerico},editada exitosamente`;
      this.callMensaje(msjExito, true);
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
      cabPagoIfDestino: ifDestino
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
      }, 500);
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
              this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 0).subscribe(
                (response) => {

                  this.showmsj = true;
                  const msjExito = `La solicitud ha sido enviada exitosamente.`;
                  this.callMensaje(msjExito, true);
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
          this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
            (response) => {
              console.log("Solicitud enviada");
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

      this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 9999).subscribe(
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
      },
      (error) => {
        console.log('Error al obtener el empleado: ', error);
      }
    );

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

          this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
            (response) => {
              //console.log('Estado de tracknig actualizado exitosamente');
              const msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido devuelta al nivel anterior.`;
              this.callMensaje(msjExito, true)
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
      this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 10).subscribe(
        (response) => {
          //console.log('Estado de tracknig actualizado exitosamente');
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

  


  //AGREGA UNA FACTURA A LA LISTA DE FACTURAS QUE LUEGO SE ENVIARAN A LA API
  addFactura() {

    const data: Factura = {
      numero: this.factura.numero,
      fecha: this.factura.fecha,
      proveedor: this.factura.proveedor,
      provRuc: this.factura.provRuc,
      ordCompra: this.factura.ordCompra,
      valorTotal: this.factura.valorTotal,
      detalles: this.detalleFacturaList
    }

    this.facturasList.push(data);

    //limpiar la cabecera del objeto factura
    this.factura = {
      numero: '',
      fecha: new Date(),
      proveedor: this.cab_proveedor,
      provRuc: this.cab_rucproveedor,
      ordCompra: '',
      valorTotal: 0,
      detalles: []
    }

    //limpiar la lista de detalles de factura
    this.detalleFacturaList = [];

    this.valorinputOC = '';
  }

  cancelarFactura(){
    this.factura = {
      numero: '',
      fecha: new Date(),
      proveedor: this.cab_proveedor,
      provRuc: this.cab_rucproveedor,
      ordCompra: '',
      valorTotal: 0,
      detalles: []
    }
    this.valorinputOC = '';
    this.detalleFacturaList = [];
  }

  deleteDetalleFactura(id: number) {
    this.detalleFacturaList.splice(id, 1);
  }

  deleteFactura(id: number) {
    this.facturasList.splice(id, 1);
  }

  /////////////////////////////////////////////SELECCIONA EL TIPO DE DESCUENTO A APLICAR//////////////////////////////////////
  tipoDescuentoFact: string = 'cash';
  $prefix: string = '$';
  x100prefix: string = '';

  x100change(){
    if(this.tipoDescuentoFact == 'x100'){
      this.$prefix = '';
      this.x100prefix = '%';
    }else if(this.tipoDescuentoFact == 'cash'){
      this.$prefix = '$';
      this.x100prefix = '';
    }
  }

  ////////////////////////////VERIFICA QUE LOS VALORES DE A FACTURA NO SOBREPASEN A LOS DE LA ORDEN DE COMPRA/////////////////////////////////
  detError: boolean = false;
  detExito: boolean = false;
  erroresDet: { mensaje: string }[] = [];
  checkTotal: boolean = false;
  verificarMontoFactura() {
    this.detError = false;
    this.erroresDet = [];
    this.checkTotal = false;

    //recorrer la lista detalleFacturaList y verificar si la cantidad de cada detalle es igual o menor a la cantidad del mismo detalle de la lista detalleFactDefault
    for (let detalle of this.detalleFacturaList) {
      for (let detalleDefault of this.detalleFactDefault) {
        if ((detalle.descProd == detalleDefault.descProd) && (detalle.itemProd == detalleDefault.itemProd)) {//encuentra los items que sean iguales
          if (detalle.cantidad > detalleDefault.cantidad) {
            console.log("item: ",detalle.descProd,", no coincide en la cantidad");
            detalle.checkC = false;//setea como false el check que verifica si la cantidad es correcta

            this.detError = true;
            this.erroresDet.push({ mensaje: `El item "${detalle.descProd}" no coincide en la cantidad autorizada. Cantidad autorizada: ${detalleDefault.cantidad}.` });

          } else {
            detalle.checkC = true;//setea como true el check que verifica si la cantidad es correcta
          }
        }
      }
    }

    //recorrer la lista detalleFacturaList y verificar si el subtotal de cada detalle es igual o menos a al subtotal del mismo detalle de la lista detalleFactDefault
    for (let detalle of this.detalleFacturaList) {
      for (let detalleDefault of this.detalleFactDefault) {
        if ((detalle.descProd == detalleDefault.descProd) && (detalle.itemProd == detalleDefault.itemProd)) {//encuentra los items que sean iguales
          if (detalle.subTotal > detalleDefault.subTotal) {
            console.log("item: ",detalle.descProd,", no coincide en el subtotal");
            detalle.checkS = false;//setea como false el check que verifica si el subtotal es correcto

            this.detError = true;
            this.erroresDet.push({ mensaje: `El item "${detalle.descProd}" no coincide en el subtotal autorizado. Subtotal autorizado: ${detalleDefault.subTotal}.` });

          } else {
            detalle.checkS = true;//setea como true el check que verifica si el subtotal es correcto
          }
        }
      }
    }

    //recorrer la lista detalleFacturaList y sumar todos los subtotales
    let totalFactura = 0;
    for (let detalle of this.detalleFacturaList) {
      totalFactura = totalFactura + detalle.subTotal;
    }

    //evaluar si todos los checks de cantidad y subtotal son true
    for (let detalle of this.detalleFacturaList) {
      if (detalle.checkC && detalle.checkS) {
        this.checkTotal = true;
      } else {
        this.checkTotal = false;
        break;
      }
    }

    if(totalFactura != this.factura.valorTotal){
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

  /////////////////////////////////////////////////CALCULOS DE DESCUENTOS Y SUBTOTAL//////////////////////////////////////////////
  calculateSubtotalDet(det: DetalleFactura) {
    if(this.tipoDescuentoFact == 'cash'){
      det.subTotal = det.cantidad * det.valorUnitario;
      det.subTotal = det.subTotal - det.descuento;
    }else if(this.tipoDescuentoFact == 'x100'){
      det.subTotal = det.cantidad * det.valorUnitario;
      det.subTotal = det.subTotal - (det.subTotal * (det.descuento/100));
    }
  }

  ////////////////////////////////////////////////////ENVIO DE LISTAS A LA API//////////////////////////////////////////
  //envio de la lista de facturas


  //envio de la lista de detalles de las facturas


  //actualizacion de los registros de la orden de compra consultada


}
