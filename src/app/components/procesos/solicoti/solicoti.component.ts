import { Component, OnInit } from '@angular/core';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { Observable, map } from 'rxjs';
import { Detalle } from 'src/app/models/procesos/Detalle';
import { ItemSector } from 'src/app/models/procesos/ItemSector';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent implements OnInit {
  empleado: string = '';
  inspector: string = '';
  showArea: string = '';
  areaNmco!: string;
  fecha: Date = new Date;
  private inputTimer: any;
  solNumerico!: string;
  noSolFormat!: string;


  //variables para guardar el tracking
  trTipoSolicitud: number = 1;//indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10;//nivel de emision por defecto
  trIdNomEmp!: number;

  //variables de la cabecera
  cab_area!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_asunto!: string;
  cab_proc!: string;
  cab_obsrv!: string;
  cab_adjCot: string = 'NO';
  cab_ncot: number = 0;
  cab_estado: string = 'A';//estado inicial Activo
  cab_plazo!: Date;
  cab_fechaMax!: Date;
  cab_inspector!: number;
  cab_telef_insp!: string;

  //variables del detalle
  det_id: number = 1;//se usa para el detalle y para el item por sector
  det_descp!: string;//se usa para el detalle y para el item por sector
  det_unidad: string = 'Unidad';
  det_cantidad: number = 0;

  //variables del item por sector
  item_id: number = 1;
  item_cant: number = 1;
  item_sector: number = 0;

  //variables para controlar la funcionalidad de la pagina
  fechaFormat: string = this.formatDateToSpanish(this.fecha);
  changeview: string = 'crear';
  msjExito!: string;
  msjError!: string;
  showmsj: boolean = false;
  showmsjerror: boolean = false;

  //listas con datos de la DB
  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  inspectores$!: Observable<any[]>;
  detallesList$!: Observable<any[]>;
  itemxSector$!: Observable<any[]>;
  sectores$!: Observable<any[]>;

  //listas locales para manejar los datos
  detalleList: Detalle[] = [];
  itemSectorList: ItemSector[] = [];
  tmpItemSect: ItemSector[] = [];
  empleados: any[] = [];
  areas: any[] = [];
  //sectores: any[] = [];
  inspectores: any[] = [];

  constructor(private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();

    this.inspectores$ = this.service.getEmpleadobyArea(12);//se le pasa el valor del id de nomina del area operaciones: 12

    this.sectores$ = this.service.getSectoresList().pipe(
      map(sectores => sectores.sort((a, b) => a.sectNombre.localeCompare(b.sectNombre)))
    );

    this.areaList$ = this.service.getAreaList();

    this.areaList$.subscribe((data) => {
      this.areas = data;
    });

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
        const empleadoSeleccionado = this.inspectores.find(emp => (emp.empleadoNombres + ' ' + emp.empleadoApellidos) === this.inspector);
        this.cab_inspector = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdNomina : null;
        console.log("Inspector ID",this.cab_inspector);
      } else {
        this.cab_inspector = 0;
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
        if ((emp.empleadoNombres + ' ' + emp.empleadoApellidos) == this.empleado) {
          this.trIdNomEmp = emp.empleadoIdNomina;
          console.log("Empleado ID:",this.trIdNomEmp);
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              this.cab_area = area.areaIdNomina;
              this.showArea = area.areaDecp;
              this.areaNmco = area.areaNemonico;
              console.log("Empleado area ID:",this.cab_area);
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.'
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
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
      "agosto", "septiembre", "octubre", "noviembre", "diciembre"
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

  cancelarAll():void{
    this.clear();
    this.ngOnInit();
  }

  cancelarItem():void{
    this.det_cantidad = 0;
    this.item_id = 1;
    this.tmpItemSect = [];
  }

  clear(): void {
    this.empleado = '';
    this.showArea = '';
    this.cab_asunto = '';
    this.det_descp = '';
    this.cab_proc = '';
    this.cab_obsrv = '';
    this.cab_adjCot = '';
    this.cab_ncot = 0;
    this.cab_plazo = new Date;
    this.cab_fechaMax = new Date;
    this.inspector = '';
    this.cab_telef_insp = '';
    this.detalleList = [];
    this.itemSectorList = [];
    this.tmpItemSect = [];
  }

  getSolName(noSol: number) {
    const noSolString = noSol.toString();
    if(noSolString.length == 1){
      this.solNumerico = this.areaNmco + " " + this.trTipoSolicitud + "-000" + noSolString;
    } else if (noSolString.length == 2){
      this.solNumerico = this.areaNmco + " " + this.trTipoSolicitud + "-00" + noSolString;
    } else if (noSolString.length == 3){
      this.solNumerico = this.areaNmco + " " + this.trTipoSolicitud + "-0" + noSolString;
    } else if (noSolString.length == 4){
      this.solNumerico = this.areaNmco + " " + this.trTipoSolicitud + "-" + noSolString;
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
          console.error('Error al obtener el último valor de solicitud:', error);
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
          solTrIdEmisor: this.trIdNomEmp
        };

        console.log("1. guardando tracking: ", dataTRK);
        this.service.generateTracking(dataTRK).subscribe(
          () => {
            console.log("Tracking guardado con éxito.");
            resolve();
          },
          (error) => {
            console.log("Error al guardar el tracking: ", error);
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
      cabSolCotTipoSolicitud: this.trTipoSolicitud,
      cabSolCotArea: this.cab_area,
      cabSolCotNoSolicitud: this.trLastNoSol,
      cabSolCotSolicitante: this.trIdNomEmp,
      cabSolCotFecha: this.cab_fecha,
      cabSolCotAsunto: this.cab_asunto,
      cabSolCotProcedimiento: this.cab_proc,
      cabSolCotObervaciones: this.cab_obsrv,
      cabSolCotAdjCot: this.cab_adjCot,
      cabSolCotNumCotizacion: this.cab_ncot,
      cabSolCotEstado: this.cab_estado,
      cabSolCotEstadoTracking: this.trNivelEmision,
      cabSolCotPlazoEntrega: this.cab_plazo,
      cabSolCotFechaMaxentrega: this.cab_fechaMax,
      cabSolCotInspector: this.cab_inspector,
      cabSolCotTelefInspector: this.cab_telef_insp,
      cabSolCotNumerico: this.solNumerico
    }


    //enviar datos de cabecera a la API
    console.log("2. guardando solicitud...", dataCAB);
    await this.service.addSolCot(dataCAB).subscribe(
      response => {
        console.log("Cabecera agregada.");
        console.log("Solicitud",this.solNumerico);
        console.log("Agregando cuerpo de la cabecera...");
        this.addBodySol();
        console.log("Cuerpo agregado.");
      },
      error => {
        console.log("error al guardar la cabecera: ", error)
      }
    );

  }

  //permite crear el detalle y el item por sector y los envia a la API
  async addBodySol() {

    this.det_id = await this.getLastDetalleCot();//numero del detalle que se va a guardar


    try {
      //enviar la lista detalle a la api para registrarla
      for (let detalle of this.detalleList) {//recorre la lista de detalles

        //crea el arreglo con las propiedades de detalle
        const data = {
          solCotTipoSol: this.trTipoSolicitud,
          solCotNoSol: this.trLastNoSol,
          solCotIdDetalle: detalle.det_id,
          solCotDescripcion: detalle.det_descp,
          solCotUnidad: detalle.det_unidad,
          solCotCantidadTotal: detalle.det_cantidad
        }

        //envia a la api el arreglo data por medio del metodo post
        this.service.addDetalleCotizacion(data).subscribe(
          response => {
            console.log("3. Detalle añadido exitosamente.");
          },
          error => {
            console.log("No se ha podido registrar el detalle, error: ", error);
          }
        );

      }
      console.log(this.detalleList);

      //enviar la lista itemsector a la api
      for (let item of this.itemSectorList) {

        const data = {
          itmTipoSol: this.trTipoSolicitud,
          itmNumSol: this.trLastNoSol,
          itmIdDetalle: item.det_id,
          itmIdItem: item.item_id,
          itmCantidad: item.item_cant,
          itmSector: item.item_sector
        }

        this.service.addItemSector(data).subscribe(
          response => {
            console.log("4. Item guardado exitosamente.");
          },
          error => {
            console.log("No se pudo guardar el item no:" + item.item_id + ", error: ", error);
          }
        );

      }
      //console.log(this.itemSectorList);

      this.getSolName(this.trLastNoSol);
      this.showmsj = true;
      this.msjExito = "Solicitud N°" + this.solNumerico + " generada exitosamente.";
      

      setTimeout(() => {
        this.msjExito = "";
        this.showmsj = false;
        this.clear();
      }, 4000);
    }
    catch (error) {
      this.showmsjerror = true;
      this.msjError = "No se ha podido generar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }

    

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
      this.service.getLastDetalleCot(this.trTipoSolicitud, this.trLastNoSol).subscribe(
        (resultado) => {
          if (resultado === 0) {
            console.log('No se ha registrado ningun detalle para esta solicitud. Se asigna 0.');
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

  //agrega los detalles a la lista detalles
  addDetalle() {

    const detalle = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      det_unidad: this.det_unidad,
      det_cantidad: this.det_cantidad
    }

    this.detalleList.push(detalle);
    //console.log(this.detalleList);

    //aumenta el valor del id de detalle
    for (let det of this.detalleList) {
      this.det_id = det.det_id + 1;
    }

    this.det_descp = '';
    this.det_unidad = 'Unidad';
    this.det_cantidad = 0;
    this.tmpItemSect = [];

  }

  //agregar los items a una lista temporal 
  //se usa una lista temporal ya que hay que limpiarla cada vez que se vaya a agregar items que pertenezcan a un detalle nuevo
  addItemSector(): void {

    const tmpItemSector = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      item_id: this.item_id,
      item_cant: this.item_cant,
      item_sector: this.item_sector
    }

    this.tmpItemSect.push(tmpItemSector);

    this.det_cantidad += this.item_cant;

    //aumenta el valor del id de los items
    for (let itm of this.tmpItemSect) {
      this.item_id = itm.item_id + 1;
    }

    this.item_cant = 1;
    this.item_sector = 0;
  }

  //agregar los items de la lista temporal a la lista definitiva
  saveItemSect(): void {

    for (let tmpitm of this.tmpItemSect) {
      const itemSector = {
        det_id: tmpitm.det_id,
        det_descp: tmpitm.det_descp,
        item_id: tmpitm.item_id,
        item_cant: tmpitm.item_cant,
        item_sector: tmpitm.item_sector
      }

      this.itemSectorList.push(itemSector);

    }
    this.item_id = 1;
    
    //console.log(this.itemSectorList);
  }

  

}