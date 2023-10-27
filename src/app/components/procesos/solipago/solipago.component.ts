import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

interface RuteoArea {
  rutareaNivel: number;
  // Otras propiedades si es necesario
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
export class SolipagoComponent implements OnInit {
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
  valorinput: string = '';
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
  cab_recibe!: number;
  cab_fechaInspeccion!: Date;
  cab_cancelarOrden!: string;
  cab_estado: string = 'A'; //estado inicial Activo
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
  alertText: string = '';
  //
  empleadoEdi: any[] = [];
  proveedores: any[] = [];
  //variables compartidas con los demas componentes
  @ViewChild(SPDocumentacionComponent) spDocumentacion!: SPDocumentacionComponent;
  @Input() sharedTipoSol: number = 3;
  @Input() sharedNoSol!: number;
  estadoSol: string = '10';
  numericoSol!: string;

  detallesToDestino: any[] = [];
  setDestino: boolean = false;
  /*settear() {
    console.log("Estes es mi metodo settea")
    this.setDestino = this.globalService.setDestino;
  }*/

  areaUserCookie: number = Number(this.cookieService.get('userArea'));


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
    private globalService: GlobalService,
    private sendMailService: SendEmailService,
    private nivGerenciaService: NivGerenciaService,
    private sharedService: SharedService
  ) {
    this.setDestino = this.globalService.setDestino;
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

  ngOnInit(): void {

    //console.log(this.sharedNoSol);

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

    if (this.changeview == 'editar') {
      this.editSolicitud();
    }


  }

  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empService.getEmpleadobyArea(parseInt(this.cookieService.get('userArea'))).subscribe((data) => {
        this.empleados = data;
      });
    } else if (this.receptor.length > 2) {
      this.empService.getEmpleadobyArea(parseInt(this.cookieService.get('userArea'))).subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }
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
          //console.log("Empleado ID:",this.trIdNomEmp);
          this.depSolTmp = emp.empleadoIdArea;
          this.cab_id_dept = emp.empleadoIdDpto;
          this.cab_id_area = emp.empleadoIdArea;
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {

              this.showArea = area.areaDecp;

              this.areaNmco = area.areaNemonico.trim();

              //busca el nuevo nombre de la solicitud y lo asigna a las variables para poder usarlo en el destino
              setTimeout(async () => {
                this.trLastNoSol = await this.getLastSol();
                this.getSolName(this.trLastNoSol);
                console.log(this.solNumerico);
                console.log(this.numericoSol);
              }, 1000);

              //console.log("Empleado area ID:",this.cab_area);
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.';
            }
          }
        }
      }
    }
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
    this.clear();
    this.ngOnInit();
    this.sharedService.spDocumentacionChange();
    this.spDocumentacion.deleteAllDocs();
  }
  //Limpiar en modulo Editar
  cancelarEdi(): void {
    this.router.navigate(['allrequest']);
    this.clear();
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
    this.cab_recibe = 0;
    this.cab_fechaInspeccion = new Date();
    this.cab_cancelarOrden = '';
  }
  //inicial SP
  getSolName(noSol: number) {
    const noSolString = noSol.toString();
    if (noSolString.length == 1) {
      this.solNumerico =
        'SP ' +
        this.areaNmco +
        ' ' +
        this.trTipoSolicitud +
        '-000' +
        noSolString;
      this.numericoSol = this.solNumerico;
    } else if (noSolString.length == 2) {
      this.solNumerico =
        'SP ' +
        this.areaNmco +
        ' ' +
        this.trTipoSolicitud +
        '-00' +
        noSolString;
      this.numericoSol = this.solNumerico;
    } else if (noSolString.length == 3) {
      this.solNumerico =
        'SP ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-0' + noSolString;
      this.numericoSol = this.solNumerico;
    } else if (noSolString.length == 4) {
      this.solNumerico =
        'SP ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-' + noSolString;
      this.numericoSol = this.solNumerico;
    }
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
          solTrIdEmisor: this.trIdNomEmp,
        };

        console.log('1. guardando tracking: ', dataTRK);
        this.solTrckService.generateTracking(dataTRK).subscribe(
          () => {
            console.log('Tracking guardado con éxito.');
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
    await this.guardarTrancking();
    await this.getSolName(this.trLastNoSol);

    const dataCAB = {
      cabPagoNumerico: this.solNumerico,
      cabPagoTipoSolicitud: this.trTipoSolicitud,
      cabPagoNoSolicitud: this.trLastNoSol,
      cabPagoIdAreaSolicitante: this.cab_id_area,
      cabPagoIdDeptSolicitante: this.cab_id_dept,
      cabPagoSolicitante: this.trIdNomEmp,
      cabPagoNoOrdenCompra: this.cab_ordencompra,
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
      cabPagoEstado: this.cab_estado,
      cabPagoEstadoTrack: this.trNivelEmision,
      cabPagoIdEmisor: this.cookieService.get('userIdNomina'),
      cabPagoApprovedBy: '000000'
    };

    //enviar datos de cabecera a la API
    console.log('2. guardando solicitud...', dataCAB);
    await this.cabPagoService.addSolPag(dataCAB).subscribe(
      (response) => {
        console.log('Cabecera agregada.');
        console.log('Solicitud', this.solNumerico);
        console.log('Agregando cuerpo de la cabecera...');
        this.showmsj = true;
        this.msjExito = 'Solicitud de Pago Generada Exitosamente';
        //this.addBodySol();
        this.AddDetSolPago();
        console.log('Cuerpo agregado.');
      },
      (error) => {
        console.log('error al guardar la cabecera: ', error);
      }
    );
  }
  //Guardar el ID DEL QUE RECIBE
  saveReceptor() {
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

  async Obtener() {
    if (this.valorinput == '') {
      this.detalleSolPagos = [];
      this.destinoIO = false;
      this.detallesToDestino = [];
    } else {
      const partes = this.valorinput.match(/(\d+)-(\d+)/);
      console.log('partes', partes);
      if (partes && partes.length === 3) {
        console.log("este mi partes ", partes[1]);
        if (partes[1] != '2') {
          this.alertBool = true;
          this.alertText = 'No se ha encontrado la solicitud';
          this.detalleSolPagos = [];
          setTimeout(() => {
            this.alertBool = false;
            this.alertText = '';
          }, 1000);
        } else {
          console.log('tiene formato pasa por aqui');
          this.noSolicinput = parseInt(partes[2], 10);
          try {
            this.detSolService
              .getDetalle_solicitud(2, this.noSolicinput)
              .subscribe(
                (response) => {

                  //console.log('response', response);
                  this.detalleSolPagos = response.map((ini: any) => ({
                    idDetalle: ini.solCotIdDetalle,
                    itemDesc: ini.solCotDescripcion,
                    itemCant: ini.solCotCantidadTotal
                  }));

                  //variables para controlar los datos ue se le pasan a destino
                  this.destinoIO = true;
                  this.detallesToDestino = response.map((detalle: any) => {
                    return {
                      idDetalle: detalle.solCotIdDetalle,
                      descpDetalle: detalle.solCotDescripcion,
                      destinoDetalle: false
                    };
                  });
                  //console.log('cambios en el map ', this.detalleSolPagos);
                },
                (error) => {
                  console.log('error al guardar la cabecera: ', error);
                }
              );
          } catch (error) {
            console.log('error', error);
          }

        }


      }
      else {
        console.log('No tiene ningun formato realizado');
      }

    }
  }
  //* Agregamos los detalles de pago a base
  AddDetSolPago() {
    for (let detPago of this.detalleSolPagos) {
      const dataDetPag = {
        detPagoTipoSol: this.trTipoSolicitud,
        detPagoNoSol: this.trLastNoSol,
        detPagoIdDetalle: detPago.idDetalle,
        detPagoItemDesc: detPago.itemDesc,
        detPagoCantContratada: detPago.cantidadContrat,
        detPagoCantRecibida: detPago.cantidadRecibid,
        detPagoValUnitario: detPago.valorUnitario,
        detPagoSubtotal: detPago.subTotal,
      };
      console.log('listas', dataDetPag);
      this.detPagoService.addSolDetPago(dataDetPag).subscribe(
        (response) => {
          console.log('Detalle Guardado ');
        },
        (error) => {
          console.log('No se puede guardar el detalle', error);
        }
      );
    }
  }
  //Calculo de Total
  calculoTotal() {
    this.Total = 0;
    for (let PagoTotal of this.detalleSolPagos) {
      this.Total = this.Total + PagoTotal.subTotal;
      console.log(`el total es to  ${this.Total}`);
    }
  }
  //Calculo  Total de Edicion
  calculoEditotal() {
    this.cabecera.cabpagototal = 0;
    for (let PagoTotal of this.detallePago) {
      this.cabecera.cabpagototal =
        this.cabecera.cabpagototal + PagoTotal.detPagoSubtotal;
      console.log(`el total es to  ${this.cabecera.cabpagototal}`);
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
    this.depSolTmp = this.cabecera.cabPagoIdAreaSolicitante;
    this.numericoSol = this.cabecera.cabPagoNumerico;

    this.estadoSol = this.cabecera.cabPagoEstadoTrack.toString();
    this.sharedTipoSol = this.cabecera.cabPagoTipoSolicitud;
    this.sharedNoSol = this.cabecera.cabPagoNoSolicitud;
    for (let det of this.solicitudEdit.detalles) {
      this.detallePago.push(det as DetallePago);
    }
    //ordenamiento de detalle de solicitud pago
    this.detallePago.sort((a, b) => a.detPagoIdDetalle - b.detPagoIdDetalle);

    //lista de detalles para el destino
    this.detallesToDestino = this.detallePago.map((detalle: any) => {
      return {
        idDetalle: detalle.detPagoIdDetalle,
        descpDetalle: detalle.detPagoItemDesc,
        destinoDetalle: true
      };
    });
    //formatear la fecha de la solicitud de pago
    this.fechaFormateada = this.formatDateToSpanish(new Date(this.cabecera.cabPagoFechaEmision))
    this.cabecera.cabPagoFechaInspeccion = format(
      parseISO(this.cabecera.cabPagoFechaInspeccion),
      'yyyy-MM-dd'
    );
    this.cabecera.cabPagoFechaFactura = format(
      parseISO(this.cabecera.cabPagoFechaFactura),
      'yyyy-MM-dd'
    );
    for (let empl of this.empleadoEdi) {
      if (empl.empleadoIdNomina == this.cabecera.cabPagoReceptor) {
        this.receptor = empl.empleadoNombres + ' ' + empl.empleadoApellidos;
      }
    }
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

      this.showmsj = true;
      this.msjExito = `Solicitud N° ${this.cabecera.cabPagoNumerico},editada exitosamente`;
      setTimeout(() => {
        this.msjExito = '';
        this.showmsj = false;
        this.router.navigate(['allrequest']);
      }, 2500);
    } catch (error) {
      console.error('Error: ' + error);
      this.showmsjerror = true;
      this.msjError =
        'No se ha podido guardar la solicitud, intente nuevamente.';
    }
  }
  async saveEditCabeceraPago() {
    const dataCAB = {
      cabPagoID: this.cabecera.cabPagoID,
      cabPagoNumerico: this.cabecera.cabPagoNumerico,
      cabPagoTipoSolicitud: this.cabecera.cabPagoTipoSolicitud,
      cabPagoNoSolicitud: this.cabecera.cabPagoNoSolicitud,
      cabPagoIdAreaSolicitante: this.cabecera.cabPagoIdAreaSolicitante,
      cabPagoIdDeptSolicitante: this.cabecera.cabPagoIdDeptSolicitante,
      cabPagoSolicitante: this.cabecera.cabPagoSolicitante,
      cabPagoNoOrdenCompra: this.cabecera.cabPagoNoOrdenCompra,
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
      cabPagoEstado: this.cabecera.cabPagoEstado,
      cabPagoEstadoTrack: this.cabecera.cabPagoEstadoTrack,
      cabPagoIdEmisor: this.cookieService.get('userIdNomina'),
      cabPagoApprovedBy: this.aprobadopor,
      cabPagoFinancieroBy: this.financieropor
    };

    console.log('esta guardo editada de cabecera solicitud ', dataCAB);
    this.cabPagoService
      .updatecabPago(this.cabecera.cabPagoID, dataCAB)
      .subscribe(
        (response) => {
          console.log('Solicitud de Pago Editado');
        },
        (error) => {
          console.log('Error', error);
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
        console.log('Buscar Proveedor: ', datos);
        this.provService.getProveedorByNombre(datos).subscribe({
          next: (data) => {
            this.proveedores = data;
            console.log('Proveedor ', this.proveedores);
            if (this.proveedores.length > 0) {
              if (this.changeview == 'crear') {
                this.cab_proveedor = this.proveedores[0].prov_nombre;
                this.cab_rucproveedor = this.proveedores[0].prov_ruc;
              } else if (this.changeview == 'editar') {
                this.cabecera.cabPagoProveedor =
                  this.proveedores[0].prov_nombre;
                this.cabecera.cabPagoRucProveedor =
                  this.proveedores[0].prov_ruc;
              }
            }
          },
          error: (error) => {
            console.error('error en buscar proveedor: ', error);
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
              console.log('Proveedor ', this.cab_proveedor);
              console.log('RUC ', this.cab_rucproveedor);
            } else if (this.changeview == 'editar') {
              this.cabecera.cabPagoProveedor = data[0].prov_nombre;
              this.cabecera.cabPagoRucProveedor = data[0].prov_ruc;
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
      this.showmsjerror = true;
      this.msjError = "No se ha podido enviar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
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
      this.showmsjerror = true;
      this.msjError = "No se ha podido enviar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }
  }

  noSolTmp: number = 0;//asegurarse que el numero de solicitud actual de la cabecera este llegando aqui
  estadoTrkTmp: number = 10;//asegurarse que el estado actual de la cabecera este llegando aqui
  depSolTmp: number = 0;//asegurarse que el area actual de la cabecera este llegando aqui


  aprobadopor: string = '000000';
  financieropor: string = '000000';
  // Método que cambia el estado del tracking de la solicitud ingresada como parámetro al siguiente nivel
  async enviarSolicitud() {
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
      let newestadoSt: string;
      //si la solicitud ya eta en el nivel 70 se cambia su estado a FINALIZADO

      if (this.estadoTrkTmp == 70) {
        //console.log("FINALIZADO");
        try {
          //console.log("Valores de actualizacion de estado:", this.trTipoSolicitud, this.noSolTmp, newEstado);
          this.cabPagoService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'F').subscribe(
            (response) => {
              this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 0).subscribe(
                (response) => {

                  this.showmsj = true;
                  this.msjExito = `La solicitud ha sido enviada exitosamente.`;

                  setTimeout(() => {
                    this.showmsj = false;
                    this.msjExito = '';
                    this.clear();
                    this.serviceGlobal.solView = 'crear';
                    this.router.navigate(['allrequest']);
                  }, 2000);
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
          this.cabPagoService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
            (response) => {
              console.log("Solicitud enviada");
              this.showmsj = true;
              this.msjExito = `La solicitud ha sido enviada exitosamente.`;

              //LLAMA AL METODO DE ENVIAR CORREO Y LE ENVIA EL SIGUIENTE NIVEL DE RUTEO
              this.sendNotify(newEstado, newestadoSt);

              setTimeout(() => {
                this.showmsj = false;
                this.msjExito = '';
                this.clear();
                this.serviceGlobal.solView = 'crear';
                this.router.navigate(['allrequest']);
              }, 2000);
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

  ///////////////////////////////////////////DOCUMENTACION DE CREACION DE PAGO/////////////////////////////////////////
  showDoc: boolean = false;
  async setNoSolDocumentacion() {
    this.sharedNoSol = await this.getLastSol();
    this.showDoc = this.showDoc ? false : true;
  }

  actionCreate: string = 'creacion';

  selectCreateAction(action: string) {
    this.actionCreate = action;
  }


  ///////////////////////////////////////////ANULACION DE SOLICITUD///////////////////////////////////////////////////

  anularSolicitud() {
    let exito: boolean = false;
    let exitotrk: boolean = false;
    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabPagoSolicitante).subscribe(
      (response: any) => {
        //console.log('Empleado: ', response);
        mailToNotify = response[0].empleadoCorreo;
        console.log("Correo enviado a: ", mailToNotify)
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
          this.showmsj = true;
          this.msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido anulada exitosamente.`;

           //notificar al emisor de la solicitud que ha sido anulada
           this.sendMail(mailToNotify,2);

          setTimeout(() => {
            this.showmsj = false;
            this.msjExito = '';
            this.clear();
            this.serviceGlobal.solView = 'crear';
            this.router.navigate(['allrequest']);
          }, 2500);
        }
      }, 500);

    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError = "No se ha podido anular la solicitud, intente nuevamente.";
      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = '';
      }, 2500);
    }

  }
  ///////////////////////////////////////////NO AUTORIZAR SOLICITUD///////////////////////////////////////////////////

  async noAutorizar() {
    await this.getNivelRuteoArea();
    console.log("Niveles de ruteo asignados: ", this.nivelRuteotoAut);


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
            this.showmsj = true;
            this.msjExito = `La solicitud N° ${this.cabecera.cabPagoNumerico} ha sido devuelta al nivel anterior.`;

            //notificar al nivel anterior del devolucion de la solicitud
            this.sendNotify(newEstado, newestadoSt);

            setTimeout(() => {
              this.showmsj = false;
              this.msjExito = '';
              this.clear();
              this.serviceGlobal.solView = 'crear';
              this.router.navigate(['allrequest']);
            }, 2500);
          },
          (error) => {
            console.log('Error al actualizar el estado: ', error);
            this.showmsjerror = true;
            this.msjError = "No se ha podido devolver la solicitud, intente nuevamente.";

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 2500);
          }
        );

        //console.log("Nuevo estado: ", newEstado);
        break;
      }

    }
  }

  ////////////////////////////////////NOTIFICACION AL SIGUIENTE NIVEL/////////////////////////////////////////////////

  async sendNotify(nivelStr: number, nivelStatus: string) {
    console.log("Nivel de ruteo: ", nivelStr);

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
                  this.sendMail(mailToNotify,1);
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

  emailContent: string = `Estimado,<br>Hemos recibido una nueva solicitud.<br>Para continuar con el proceso, le solicitamos que revise y apruebe esta solicitud para que pueda avanzar al siguiente nivel de ruteo.<br>Esto garantizará una gestión eficiente y oportuna en el Proceso de Compras.<br>Por favor ingrese a la app SOLICITUDES para acceder a la solicitud.`;

  emailContent2: string = `Estimado,<br>Le notificamos que la solicitud de orden de compra generada ha sido anulada, si desea conocer más detalles pónganse en contacto con el departamento de compras o financiero.`;

  sendMail(mailToNotify: string, type: number) {
    let contenidoMail = '';

    if(type == 1){
      contenidoMail = this.emailContent;
    } else if(type == 2){
      contenidoMail = this.emailContent2;
    }

    setTimeout(() => {
      const data = {
        destinatario: mailToNotify,
        //destinatario: 'joseguillermojm.jm@gmail.com',
        asunto: 'Nueva Solicitud Recibida - Acción Requerida',
        contenido: contenidoMail
      }

      this.sendMailService.sendMailto(data).subscribe(
        response => {
          console.log("Exito, correo enviado");
          // this.showmsj = true;
          // this.msjExito = `Correos enviados exitosamente.`;

          // setTimeout(() => {
          //   this.showmsj = false;
          //   this.msjExito = '';
          // }, 4000)

        },
        error => {
          console.log(`Error, no se ha podido enviar el correo al proveedor.`, error)
          this.showmsjerror = true;
          this.msjError = `Error, no se ha podido enviar el correo al proveedor, intente nuevamente.`;

          setTimeout(() => {
            this.showmsjerror = false;
            this.msjError = '';
          }, 4000)
        }
      );
    }, 500);
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
}
