import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { CabeceraPago } from 'src/app/models/procesos/solcotizacion/CabeceraPago';
import { GlobalService } from 'src/app/services/global.service';
import { DetallePago } from 'src/app/models/procesos/solcotizacion/DetallePago';


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
  areaList$!: Observable<any[]>;
  areas: any[] = [];
  areaNmco!: string;
  solNumerico!: string;
  fecha: Date = new Date();
  fechaFormateada: string = this.formatDateToSpanish(this.fecha);
  receptor!: string;
  //*Variables de input para solicitar tipo de solicitud  y no solicitud
  valorinput: string = '';
  tipoSolinput!: number;
  noSolicinput!: number;
  //Creacion de Lista para guardar los tipos de solicit y no solicitud
  detalleSolPagos: any[] = [];

  changeview: string = this.serviceGlobal.solView;
  //Mensaje
  msjExito!: string;
  msjError!: string;
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  //
  SolID: number = this.serviceGlobal.solID;
  //*variables de cabecera
  cab_area!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_ordencompra!: string;
  cab_nofactura!: string;
  cab_fechafactura!: Date;
  cab_proveedor!: number;
  cab_rucproveedor!: string;
  cab_observa!: string;
  cab_aplicarmult!: string;
  cab_valordescontar!: 0;
  cab_totalautorizado!: string;
  cab_recibe!: number;
  cab_fechaInspeccion!: Date;
  cab_cancelarOrden!: string;
  cab_estado: string = 'A'; //estado inicial Activo
  //*
  cabecera!: CabeceraPago;
  detallePago:DetallePago[] = [];
  solicitudEdit!: SolicitudData;

  //* Variables para guardar el traking
  trTipoSolicitud: number = 3; //indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10; //nivel de emision por defecto
  trIdNomEmp!: number;
  //
  Total: number=0;
  //
  empleadoEdi:any[]=[];

  constructor(private service: CommunicationApiService,private serviceGlobal: GlobalService) {}

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();

    this.areaList$ = this.service.getAreaList();

    this.areaList$.subscribe((data) => {
      this.areas = data;
    });
    if (this.changeview == 'editar') {
      this.editSolicitud();
    }
  }

  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empleadosList$.subscribe((data) => {
        this.empleados = data;
      });
    } else if (this.receptor.length > 2) {
      this.empleadosList$.subscribe((data) => {
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
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              this.cab_area = area.areaIdNomina;
              this.showArea = area.areaDecp;

              this.areaNmco = area.areaNemonico;
              //console.log("Empleado area ID:",this.cab_area);
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.';
            }
          }
        }
      }
    }
  }
  //* Metodo para agregar la Cabecera
  //NOTE
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
  //Limpiar
  cancelarAll(): void {
    this.clear();
  }
  //
  clear(): void {
    this.empleado = '';
    this.cab_ordencompra = '';
    this.showArea = '';
    this.cab_nofactura = '';
    this.cab_fechafactura = new Date();
    this.cab_proveedor = 0;
    this.cab_rucproveedor = '';
    this.cab_observa = '';
    this.cab_aplicarmult = '';
    this.cab_valordescontar = 0;
    this.cab_totalautorizado = '';
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
    } else if (noSolString.length == 2) {
      this.solNumerico =
        'SP ' +
        this.areaNmco +
        ' ' +
        this.trTipoSolicitud +
        '-00' +
        noSolString;
    } else if (noSolString.length == 3) {
      this.solNumerico =
        'SP ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-0' + noSolString;
    } else if (noSolString.length == 4) {
      this.solNumerico =
        'SP ' + this.areaNmco + ' ' + this.trTipoSolicitud + '-' + noSolString;
    }
  }
  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  getLastSol(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.service.getLastSolicitud(this.trTipoSolicitud).subscribe(
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

        const dataTRK = {
          solTrTipoSol: this.trTipoSolicitud,
          solTrNumSol: this.trLastNoSol,
          solTrNivel: this.trNivelEmision,
          solTrIdEmisor: this.trIdNomEmp,
        };

        console.log('1. guardando tracking: ', dataTRK);
        this.service.generateTracking(dataTRK).subscribe(
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
    this.getSolName(this.trLastNoSol);

    const dataCAB = {
      cabPagoNumerico: this.solNumerico,
      cabPagoTipoSolicitud: this.trTipoSolicitud,
      cabPagoNoSolicitud: this.trLastNoSol,
      cabPagoAreaSolicitante: this.cab_area,
      cabPagoSolicitante: this.trIdNomEmp,
      cabPagoNoOrdenCompra: this.cab_ordencompra,
      cabPagoFechaEmision: this.cab_fecha,
      cabPagoFechaEnvio: this.cab_fecha,
      cabPagoNumFactura: this.cab_nofactura,
      cabPagoFechaFactura: this.cab_fechafactura,
      cabPagoProveedor: 23,
      cabPagoRucProveedor: this.cab_rucproveedor,
      cabpagototal:this.Total,
      cabPagoObservaciones: this.cab_observa,
      cabPagoAplicarMulta: this.cab_aplicarmult,
      cabPagoValorMulta: this.cab_valordescontar,
      cabPagoValorTotalAut: this.cab_totalautorizado,
      cabPagoReceptor: this.cab_recibe,
      cabPagoFechaInspeccion: this.cab_fechaInspeccion,
      cabPagoCancelacionOrden: this.cab_cancelarOrden,
      cabPagoEstado: this.cab_estado,
      cabPagoEstadoTrack: this.trNivelEmision,
    };

    //enviar datos de cabecera a la API
    console.log('2. guardando solicitud...', dataCAB);
    await this.service.addSolPag(dataCAB).subscribe(
      (response) => {
        console.log('Cabecera agregada.');
        console.log('Solicitud', this.solNumerico);
        console.log('Agregando cuerpo de la cabecera...');
        this.showmsj=true;
        this.msjExito='Solicitud de Pago Generada Exitosamente'; 
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
        this.cab_recibe = emp.empleadoIdNomina;
        //console.log("Empleado ID:",this.trIdNomEmp);
      }
    }
    
    console.log(`cAMBIOS EN ESTO ${this.cab_recibe}`);
  }
  async Obtener() {
    const partes = this.valorinput.match(/(\d+)-(\d+)/);
    console.log(partes);
    if (partes && partes.length === 3) {
      this.tipoSolinput = parseInt(partes[1], 10);
      this.noSolicinput = parseInt(partes[2], 10);
      console.log('Tipo de solicitus', this.tipoSolinput);
      console.log('Numero de solicitud', this.noSolicinput);
    } else {
      console.log('No tiene ningun formato realizado');
    }
    console.log('el valor de la de los input', this.valorinput);
    try {
      this.service
        .getDetalle_solicitud(this.tipoSolinput, this.noSolicinput)
        .subscribe(
          (response) => {
            console.log('esto hay en el response', response);
            this.detalleSolPagos = response.map((ini: any) => ({
              idDetalle:ini.solCotIdDetalle,
              itemDesc: ini.solCotDescripcion,
            }));
            console.log('cambios ', this.detalleSolPagos);
          },
          (error) => {
            console.log('error al guardar la cabecera: ', error);
          }
        );
    } catch (error) {
      console.log('error', error);
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
      this.service.addSolDetPago(dataDetPag).subscribe(
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
  calculoTotal(){
    this.Total = 0;
    for(let PagoTotal of this.detalleSolPagos){
      this.Total=this.Total+PagoTotal.subTotal;
      console.log(`el total es to  ${this.Total}`);
    }
  }
  async editSolicitud(){
    this.getSoliPagos();
    this.saveData();

  }
  //* Obtener los datos de cabecera de solicitud y detalle
  async getSoliPagos(){
    try{
      const data = await this.service.getSolPagobyId(this.SolID).toPromise();
      this.solicitudEdit=data;
    }catch(error){
      console.error("Error en la solicitud",error)
    }
  }
  async saveData(){
    this.cabecera=this.solicitudEdit.cabecera;
    for(let det of this.solicitudEdit.detalles){
      this.detallePago.push(det as DetallePago);
    }
    }
}
