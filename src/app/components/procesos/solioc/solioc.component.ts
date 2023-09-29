import { Component, OnInit,Input } from '@angular/core';

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
import { es, oc } from 'date-fns/locale';
import { DetalleCotizacion } from 'src/app/models/procesos/solcotizacion/DetalleCotizacion';
import { ItemCotizacion } from 'src/app/models/procesos/solcotizacion/ItemCotizacion';
import { GlobalService } from 'src/app/services/global.service';
import { CabeceraOrdenCompra } from 'src/app/models/procesos/solcotizacion/CabeceraOrdenCompra';
import { CookieService } from 'ngx-cookie-service';

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
export class SoliocComponent implements OnInit {
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
  trIdNomEmp!: number;

  //variables de la cabecera
  cab_area!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_asunto!: string;
  cab_proc!: string;
  cab_obsrv!: string;
  cab_adjCot: string = 'NO';
  cab_ncot: number = 0;
  cab_estado: string = 'A'; //estado inicial Activo
  cab_plazo!: Date;
  cab_fechaMax!: Date;
  cab_inspector!: number;
  cab_telef_insp!: string;
  cab_ruc_prov!: string;
  cab_proveedor!: string;

  //variables del detalle
  det_id: number = 1; //se usa para el detalle y para el item por sector
  det_descp!: string; //se usa para el detalle y para el item por sector
  det_unidad: string = 'Unidad';
  det_cantidad: number = 0;

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
  @Input() sharedTipoSol!: number;
  @Input() sharedNoSol!: number;
  estadoSol!: string;

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
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.empleadosList$ = this.empService.getEmpleadosList();
    this.empleadosList$.subscribe((data) => {
      this.empleadoedit = data;
    });

    this.inspectores$ = this.empService.getEmpleadobyArea(12); //se le pasa el valor del id de nomina del area operaciones: 12
    this.inspectores$.subscribe((data) => {
      this.inspectoresEdit = data;
    });
    this.nivelRut$ = this.nivRuteService
      .getNivelbyEstado('A')
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
    if (this.changeview == 'editar') {
      this.editSolicitud();
    }
  }

  //guarda los datos de los empleados en una lista local dependiendo del tamaño de la variable de busqueda, esto se controla con un keyup
  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empleadosList$.subscribe((data) => {
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
            : null;
          console.log('Inspector ID', this.cab_inspector);
        } else if (this.changeview == 'editar') {
          this.cabecera.cabSolOCInspector = empleadoSeleccionado
            ? empleadoSeleccionado.empleadoIdNomina
            : null;
          console.log(
            'Inspector id de Cabecera',
            this.cabecera.cabSolOCInspector
          );
        }
      } else {
        this.cab_inspector = 0;
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

  //guarda la solicitud con estado emitido
  async generarSolicitud() {
    await this.guardarTrancking();
    this.getSolName(this.trLastNoSol);

    const dataCAB = {
      cabSolOCTipoSolicitud: this.trTipoSolicitud,
      cabSolOCArea: this.cab_area,
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
    };

    //enviar datos de cabecera a la API
    console.log('2. guardando solicitud...', dataCAB);
    await this.cabOCService.addSolOC(dataCAB).subscribe(
      (response) => {
        console.log('Cabecera agregada.');
        console.log('Solicitud', this.solNumerico);
        console.log('Agregando cuerpo de la cabecera...');
        this.addBodySol();
        console.log('Cuerpo agregado.');
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
      this.showmsj = true;
      this.msjExito =
        'Solicitud N°' + this.solNumerico + ' generada exitosamente.';

      setTimeout(() => {
        this.msjExito = '';
        this.showmsj = false;
        this.clear();
      }, 4000);
    } catch (error) {
      this.showmsjerror = true;
      this.msjError =
        'No se ha podido generar la solicitud, intente nuevamente.';

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = '';
      }, 2500);
    }
  }
  //
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
      };
      //envia a la api el arreglo data por medio del metodo post
      this.detCotService.addDetalleCotizacion(data).subscribe(
        (response) => {
          console.log('3. Detalle añadido exitosamente.');
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
          console.log('4. Item guardado exitosamente.');
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
              console.log(
                'No se ha registrado ningun detalle para esta solicitud. Se asigna 0.'
              );
              resolve(1);
            } else {
              const lastDetCot = resultado[0].solCotID + 1;
              console.log('Nuevo detalle: ', lastDetCot);
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
      this.msjError =
        'Error, asegúrese de ingresar todos los detalles antes de registrar la solicitud.';

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = '';
      }, 2500);
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
    };

    this.detalleList.push(detalle);
    this.incrementDetID();

    if (!this.detType) {
      this.item_id = 1;
    }
    //
    if (this.changeview == 'editar') {
      this.saveLocaltoResponse();
      console.log('item a enviar a APi ');
    }

    this.det_descp = '';
    this.det_unidad = 'Unidad';
    this.det_cantidad = 0;
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

    console.log(index);
    if (index !== -1) {
      console.log('detalle eliminado');
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

    console.log(index);
    if (index !== -1) {
      console.log('item eliminado');
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
      const data = await this.cabOCService
        .getOrdenComprabyId(this.SolID)
        .toPromise();
      this.solicitudEdit = data;
    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
    }
  }

  async saveData() {
    //guardar los datos de la lista solicitud edit en los objetos cabecera, detalle e item
    this.cabecera = this.solicitudEdit.cabecera;
    this.sharedTipoSol=this.cabecera.cabSolOCTipoSolicitud;
    this.sharedNoSol=this.cabecera.cabSolOCNoSolicitud;

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
    this.cabecera.cabSolOCFechaMaxentrega = format(
      parseISO(this.cabecera.cabSolOCFechaMaxentrega),
      'yyyy-MM-dd'
    );
    for (let empl of this.inspectoresEdit) {
      if (empl.empleadoIdNomina == this.cabecera.cabSolOCInspector) {
        this.inspector = empl.empleadoNombres + ' ' + empl.empleadoApellidos;
      }
    }

    // Formatear el plazo de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolOCPlazoEntrega = format(
      parseISO(this.cabecera.cabSolOCPlazoEntrega),
      'yyyy-MM-dd'
    );

    //ordena los items de la lista segun el id del detalle de menor a mayor
    this.item.sort((a, b) => a.itmIdDetalle - b.itmIdDetalle);
  }

  get estadoTexto(): string {
    switch (this.cabecera.cabSolOCEstado) {
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
    console.log(this.idDlt, this.idItmDlt, this.idNSolDlt);
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
  //
  // async saveItemDB() {
  //   try {
  //     await this.deleteAllItems();
  //     setTimeout(() => {
  //       this.reorderAndSaveItems();
  //       this.checkAndDeleteDetails();
  //     }, 200);
  //     console.log('Proceso completado exitosamente.');
  //   } catch (error) {
  //     console.error('Error durante el proceso:', error);
  //   }
  // }
  // async deleteAllItems() {
  //   try {
  //     await this.service
  //       .deleteAllItemBySol(this.trTipoSolicitud, this.idNSolDlt)
  //       .subscribe(
  //         (response) => {
  //           console.log('todos los Item eliminados');
  //         },
  //         (error) => {
  //           console.log('Error: ', error);
  //         }
  //       );
  //   } catch (error) {
  //     console.error('Error durante la eliminación:', error);
  //   }
  // }
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
          console.log('Item guardado exitosamente.');
        },
        (error) => {
          console.log('No se pudo guardar el item, error: ', error);
        }
      );
    }
  }
  // async checkAndDeleteDetails() {
  //   //verificar si algun detalle no tiene items y eliminarlo
  //   for (let det of this.detalle) {
  //     console.log(this.trTipoSolicitud, this.idNSolDlt, det.solCotIdDetalle);

  //     this.service
  //       .getItemsbyDet(
  //         this.trTipoSolicitud,
  //         this.idNSolDlt,
  //         det.solCotIdDetalle
  //       )
  //       .subscribe(
  //         (response) => {
  //           if (response === 0) {
  //             console.log(
  //               'NO existen items para el detalle: ',
  //               det.solCotIdDetalle
  //             );
  //             //eliminar el detalle
  //             this.service.deleteDetallebyId(det.solCotID).subscribe(
  //               (response) => {
  //                 console.log('Se ha eliminado el detalle.');
  //               },
  //               (error) => {
  //                 console.log('No se pudo eliminar el detalle, error: ', error);
  //               }
  //             );
  //           } else {
  //             console.log(
  //               'SI existen items para el detalle: ',
  //               det.solCotIdDetalle
  //             );
  //           }
  //         },
  //         (error) => {
  //           console.log('Error: ', error);
  //         }
  //       );
  //   }
  // }
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
      cabSolOCArea: this.cabecera.cabSolOCArea,
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
    };
    //* Enviar datos para actualizar en tabla cab_sol_orden_compra
    console.log('2. guardando solicitud...', dataCAB);
    this.cabOCService
      .updateOrdencompra(this.cabecera.cabSolOCID, dataCAB)
      .subscribe(
        (response) => {
          console.log('Datos actualizados con éxito. ');
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
      };
      console.log('Nuevo detalle: ', data);
      this.detCotService.addDetalleCotizacion(data).subscribe(
        (response) => {
          console.log(
            'Nuevo detalle',
            detalle.solCotIdDetalle,
            ' guardado en la base'
          );
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
              console.log('Todos los detalles eliminados');
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
      console.log('Nuevo item: ', data);

      this.itmSectService.addItemSector(data).subscribe(
        (response) => {
          console.log(
            'Nuevo item guardado en la base, item:',
            item.itmIdItem,
            ', detalle:',
            item.itmIdDetalle
          );
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
              console.log('Todos los items eliminados');
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
        console.log('El detalle ya existe, no se ha guardado');
      } else {
        console.log('Guardando detalle nuevo:', detalle.det_id);

        const data = {
          solCotTipoSol: this.cabecera.cabSolOCTipoSolicitud,
          solCotNoSol: this.cabecera.cabSolOCNoSolicitud,
          solCotIdDetalle: detalle.det_id,
          solCotDescripcion: detalle.det_descp,
          solCotUnidad: detalle.det_unidad,
          solCotCantidadTotal: detalle.det_cantidad,
        };
        //console.log("Nuevo detalle: ",data);
        this.detCotService.addDetalleCotizacion(data).subscribe(
          (response) => {
            console.log(
              'Nuevo detalle',
              detalle.det_id,
              ' guardado en la base'
            );
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
          console.log(
            'Nuevo item guardado en la base, item:',
            item.item_id,
            ', detalle:',
            item.det_id
          );
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
    console.log(this.item);
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
    console.log('Detalle a eliminar numero ', index);

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
    console.log(this.item);
  }
  openModalItem() {
    this.item_id = 1;
  }
  async saveEdit() {
    try {
      await this.saveEditCabecera();
      await this.saveEditDetalle();
      await this.saveEditItem();

      this.showmsj = true;
      this.msjExito =
        'Solicitud N°' +
        this.cabecera.cabSolOCNumerico +
        ' editada exitosamente.';

      setTimeout(() => {
        this.msjExito = '';
        this.showmsj = false;
        this.router.navigate(['allrequest']);
        this.clear();
      }, 2500);
    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError =
        'No se ha podido guardar la solicitud, intente nuevamente.';

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = '';
      }, 2500);
    }
  }
  //Buscar Proveedor y guardar
  searchProveedor(datos: string): void {
    if (datos.length > 2) {
      console.log('Buscar Proveedor: ', datos);
      this.provService.getProveedorByNombre(datos).subscribe(
        (data) => {
          this.proveedores = data;
          console.log('Proveedor ', this.proveedores);
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
      console.log('Buscar Proveedor por RUC: ', datos);
      this.provService.getProveedorByRUC(datos).subscribe({
        next: (data) => {
          console.log('mis datos ', data);
          if (data) {
            if (this.changeview == 'crear') {
              this.cab_proveedor = data[0].prov_nombre;
              this.cab_ruc_prov = data[0].prov_ruc;
              console.log('Proveedor ', this.cab_proveedor);
              console.log('RUC ', this.cab_ruc_prov);
            } else if (this.changeview == 'editar') {
              this.cabecera.cabSolOCProveedor = data[0].prov_nombre;
              this.cabecera.cabSolOCRUCProveedor = data[0].prov_ruc;
              console.log(
                'Proveedor  de cabecera',
                this.cabecera.cabSolOCProveedor
              );
              console.log(
                'Proveedor  de RUC CABECERA',
                this.cabecera.cabSolOCRUCProveedor
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
      console.error('Error al Obtener el RUC del Proveedor:', error);
    }
  }
  //* Actiones
  actionEdit:string='edicion';
  selectEditAction(action:string){
    this.actionEdit=action;
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
}
