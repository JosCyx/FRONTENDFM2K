import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { FichaGestEventoService } from 'src/app/services/comunicationAPI/gest-eventos/ficha-gest-evento.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalGestEventosService } from 'src/app/services/global-gest-eventos.service';


interface GestEvento {
  nombreEvento: string,
  usuarioSolicitante: number,
  tipoContrato: number,
  localidad: number,
  tipoPago: number,
  pagoTotal: number,
  pagoAbono: number,
  descripcion: string,
  estadoProceso: number,
}

interface Cliente {
  codigo: string,
  clienteNombre: string,
  cedula: string,
  direccion: string,
  telefono: string,
  correo: string,
}

interface Fecha {
  tipo: number,
  fechaInicio: Date,
  horaInicio: string,
  fechaFin: Date,
  horaFin: string,
}


@Component({
  selector: 'app-formulario-evento-gest',
  templateUrl: './formulario-evento-gest.component.html',
  styleUrls: ['./formulario-evento-gest.component.css'],

})
export class FormularioEventoGestComponent {
  // Referencia al template del diálogo
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  //listas de datos
  clienteList: any[] = [];
  clienteListFiltered: any[] = [];
  localidadList: any[] = [];
  localidadListFiltered: any[] = [];
  tipoContratoList: any[] = [];
  tipoContratoListFiltered: any[] = [];
  empleadosList: any[] = [];
  empleadosListFiltered: any[] = [];
  tipoFechaList: any[] = [];
  tipoPagoList: any[] = [];

  //variables que almacenan el nombre de los datalist
  nombreEmpleado: string = '';
  nombreCliente: string = '';
  nombreTipoContrato: string = '';
  nombreLocalidad: string = '';
  nombreTipoFecha: string = '';

  //objeto que almacena las propiedades del evento
  gestEvento: GestEvento = {
    nombreEvento: '',
    usuarioSolicitante: 0,
    tipoContrato: 0,
    localidad: 0,
    tipoPago: 0,
    pagoTotal: 0,
    pagoAbono: 0,
    descripcion: '',
    estadoProceso: 0,
  }

  //objeto que almacena las propiedades del cliente
  cliente: Cliente = {
    codigo: '',
    clienteNombre: '',
    cedula: '',
    direccion: '',
    telefono: '',
    correo: '',
  }



  constructor(
    public dialog: MatDialog,
    public GlobalGestEventosService: GlobalGestEventosService,
    private fichaGestEvService: FichaGestEventoService,
        private dialogService: DialogServiceService,
  ) { }


  ngOnDestroy(): void {
    this.GlobalGestEventosService.editMode = false;
    this.GlobalGestEventosService.idEventoSelected = 0;
  }


  ngOnInit(): void {
    setTimeout(async() => {
      const empleados$ = this.fichaGestEvService.getEmpleadoList();
      const localidad$ = this.fichaGestEvService.getLocalidadList();
      const tipoContrato$ = this.fichaGestEvService.getTipoContratoList();
      const cliente$ = this.fichaGestEvService.getClientesList();
      const tipoFecha$ = this.fichaGestEvService.getTipoFechaList();
      const tipoPago$ = this.fichaGestEvService.getTipoPagoList();

      //Usar forkJoin para esperar a que todas las observables se completen
      await forkJoin([empleados$, localidad$, tipoContrato$, cliente$, tipoFecha$, tipoPago$]).subscribe(
        ([empleadosData, localidadData, tipoContratoData, clienteData, tipoFechaData, tipoPagoData]) => {
          this.empleadosList = _.cloneDeep(empleadosData);
          this.empleadosListFiltered = _.cloneDeep(empleadosData);

          this.localidadList = _.cloneDeep(localidadData);
          this.localidadListFiltered = _.cloneDeep(localidadData);

          this.tipoContratoList = _.cloneDeep(tipoContratoData);
          this.tipoContratoListFiltered = _.cloneDeep(tipoContratoData);

          this.clienteList = _.cloneDeep(clienteData);
          this.clienteListFiltered = _.cloneDeep(clienteData);

          this.tipoFechaList = _.cloneDeep(tipoFechaData);

          this.tipoPagoList = _.cloneDeep(tipoPagoData);

          if (this.GlobalGestEventosService.editMode) {
            // Cargar los datos del evento seleccionado
            this.loadEventoData();
          }
        }
      );

    }, 200);

  }

  loadEventoData() {
    const idEventSelected = this.GlobalGestEventosService.idEventoSelected;

    //consultar los datos del evento seleccionado
    this.fichaGestEvService.getFichaGestEventoById(idEventSelected).subscribe(
      (response) => {
        this.gestEvento = {
          nombreEvento: response.evNombre,
          usuarioSolicitante: response.evEmpleado,//
          tipoContrato: response.evTipoContrato,
          localidad: response.evLocalidad,//
          tipoPago: response.evTipoPago,
          pagoTotal: response.evPagoTotal,
          pagoAbono: response.evPagoAbono,
          descripcion: response.evDescripcion,
          estadoProceso: response.evEstado,
        }

        const solicitante = this.empleadosList.find(emp => emp.empleadoIdNomina == response.evEmpleado);
        this.nombreEmpleado = solicitante.empleadoNombres + ' ' + solicitante.empleadoApellidos;
        this.nombreCliente = this.clienteList.find(cli => cli.cliId === response.evCliente).cliNombre;
        this.nombreLocalidad = this.localidadList.find(loc => loc.locId === response.evLocalidad).locNombre;
      },
      (error) => {
        console.error("Error al cargar los datos del evento", error);
        this.callMensaje("Error al cargar los datos del evento", false);
      }
    );


    this.fichaGestEvService.getFechasById(idEventSelected).subscribe(
      (response) => {
        //console.log("Fechas del evento", response);

        if(response.length == 0){
          this.callMensaje("No se encontraron fechas para el evento", false);
        }

        //mapear las fechas en el formato correcto
        this.fechasList = response.map((fecha: any) => {
          return {
            tipo: fecha.fechaTipoFecha,
            fechaInicio: new Date(fecha.fechaInicio),
            fechaFin: new Date(fecha.fechaFin),
          }
        });

        //ordenar las fechas por tipo de menor a mayor
        this.fechasList = _.sortBy(this.fechasList, ['tipo']);
      },
      (error) => {
        console.error("Error al cargar las fechas del evento", error);
        this.callMensaje("Error al cargar las fechas del evento", false);
      }
    )
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  clearEventoData() {
    //limpiar el registo de evento
    this.gestEvento = {
      nombreEvento: '',
      usuarioSolicitante: 0,
      tipoContrato: 0,
      localidad: 0,
      tipoPago: 0,
      pagoTotal: 0,
      pagoAbono: 0,
      descripcion: '',
      estadoProceso: 0,
    }
    //limpiar el registro de cliente
    this.cliente = {
      codigo: '',
      clienteNombre: '',
      cedula: '',
      direccion: '',
      telefono: '',
      correo: '',
    }
    //limpiar el registro de fechas
    this.fechasList = [];
    
    //limpiar el objeto de fechas
    this.FechasObj = { tipo: 0, fechaInicio: undefined, horaInicio: '', fechaFin: undefined, horafin: '' };

    this.nombreCliente = '';
    this.nombreEmpleado = '';
    this.nombreLocalidad = '';
  }


  clearNuevoCliente() {
    //limpiar el registro de cliente
    this.cliente = {
      codigo: '',
      clienteNombre: '',
      cedula: '',
      direccion: '',
      telefono: '',
      correo: '',
    }
  }


  cancelEvento() {
    this.clearEventoData();
  }

  disableDateType(tipo: number) {
    return this.fechasList.some(fecha => fecha.tipo === tipo);
  }

  filterEmpleados(filterValue: string) {
    this.empleadosListFiltered = this.empleadosList.filter(emp =>
      (emp.empleadoNombres + ' ' + emp.empleadoApellidos).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  filterClientes(filterValue: string) {
    this.clienteListFiltered = this.clienteList.filter(cli =>
      (cli.cliNombre).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  filterLocalidad(filterValue: string) {
    this.localidadListFiltered = this.localidadList.filter(loc =>
      (loc.locNombre).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  filterTipoContrato(filterValue: string) {
    this.tipoContratoListFiltered = this.tipoContratoList.filter(cont =>
      (cont.contrNombre).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  updateEmpleadosListFiltered(event: any) {
    this.filterEmpleados(event.target.value);
  }

  updateClientesListFiltered(event: any) {
    this.filterClientes(event.target.value);
  }

  updateLocalidadListFiltered(event: any) {
    this.filterLocalidad(event.target.value);
  }

  updateTipoContratoListFiltered(event: any) {
    this.filterTipoContrato(event.target.value);
  }

  updateHorasListFiltered(event: any, idList: number) {
    if (idList == 1) {
      this.timeListFiltered1 = this.timeList.filter(time => time.includes(event.target.value));
    } else {
      this.timeListFiltered2 = this.timeList.filter(time => time.includes(event.target.value));
    }
  }

  // Método para abrir la ventana emergente
  abrirVentanaAgregarCliente(): void {
    this.dialog.open(this.dialogTemplate, {
      width: '700px',
    });
  }

  // Método para cerrar el diálogo
  cerrarDialog(): void {
    this.dialog.closeAll();
    this.clearNuevoCliente();
  }

  //-----------------------------------------------------------------------------------------------------------------------------------//
  //lista de fechas del evento
  fechasList: {
    tipo: number,
    fechaInicio: Date,
    fechaFin: Date
  }[] = [];

  //objeto que guarda la fecha que se va a ingresar
  FechasObj: {
    tipo: number,
    fechaInicio: Date | undefined,
    horaInicio: string,
    fechaFin: Date | undefined,
    horafin: string
  } = { tipo: 0, fechaInicio: new Date, horaInicio: '', fechaFin: new Date, horafin: '' };

  displayedColumns: string[] = ['tipo', 'fechaInicio', 'fechaFin', 'acciones'];

  minDate: Date = new Date();  // Fecha mínima es la fecha actual
  fechasDeshabilitadas = { fechaInicioDisabled: false, fechaFinDisabled: false };
  editIndex: number | null = null;  // Almacena el índice del registro a editar, si aplica

  timeList: string[] = [
    '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
    '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
    '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
    '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
    '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
    '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
    '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
    '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
    '08:00', '08:10', '08:20', '08:30', '08:40', '08:50',
    '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
    '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
    '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
    '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
    '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
    '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
    '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
    '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
    '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
    '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
    '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
    '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
    '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
    '23:00', '23:10', '23:20', '23:30', '23:40', '23:50'
  ];

  timeListFiltered1: string[] = _.cloneDeep(this.timeList);
  timeListFiltered2: string[] = _.cloneDeep(this.timeList);

  async setFormatTime() {
    if(this.FechasObj.fechaInicio == undefined || this.FechasObj.fechaFin == undefined){
      console.log("Fechas no definidas");
      return;
    }

    const fechaInicio = new Date(this.FechasObj.fechaInicio);
    const horaInicio = this.FechasObj.horaInicio.split(':');
    fechaInicio.setHours(parseInt(horaInicio[0]));
    fechaInicio.setMinutes(parseInt(horaInicio[1]));
    this.FechasObj.fechaInicio = fechaInicio;

    const fechaFin = new Date(this.FechasObj.fechaFin);
    const horaFin = this.FechasObj.horafin.split(':');
    fechaFin.setHours(parseInt(horaFin[0]));
    fechaFin.setMinutes(parseInt(horaFin[1]));
    this.FechasObj.fechaFin = fechaFin;
  }

  async agregarRegistro() {
    if (this.registroValido()) {

      await this.setFormatTime();

      const dateNow = new Date();

      const registro = {
        tipo: this.FechasObj.tipo,
        fechaInicio: this.FechasObj.fechaInicio ? this.FechasObj.fechaInicio : dateNow,
        horaInicio: this.FechasObj.horaInicio ? this.FechasObj.horaInicio : '00:00',
        fechaFin: this.FechasObj.fechaFin ? this.FechasObj.fechaFin : dateNow,
        horafin: this.FechasObj.horafin ? this.FechasObj.horafin : '00:00'
      };

      if (this.editIndex !== null) {
        // Si estamos en modo edición, actualizamos el registro existente
        this.fechasList[this.editIndex] = registro;
        this.editIndex = null;
      } else {
        // Si no estamos editando, añadimos el nuevo registro
        this.fechasList.push(registro);
        this.tipoFechaList = this.tipoFechaList.filter(tipo =>
          !this.fechasList.some(registro => registro.tipo === tipo)
        );
      }

      this.fechasList = [...this.fechasList];
      this.FechasObj = { tipo: 0, fechaInicio: undefined, horaInicio: '', fechaFin: undefined, horafin: '' };
    }
  }

  eliminarRegistro(index: number) {
    this.fechasList.splice(index, 1);
    this.fechasList = [...this.fechasList];
    this.tipoFechaList = this.tipoFechaList.filter(tipo =>
      !this.fechasList.some(registro => registro.tipo === tipo)
    );
    
  }

  //validar que los campos de la fecha no esten vacios
  registroValido(): boolean {
    if(this.FechasObj.fechaInicio == undefined || this.FechasObj.fechaFin == undefined){
      console.log("Fechas no definidas");
      return false
    }
    return (
      this.FechasObj.tipo !== 0 &&
      this.FechasObj.fechaInicio !== null &&
      this.FechasObj.horaInicio !== '' &&
      this.FechasObj.fechaFin !== null &&
      this.FechasObj.horafin !== '' &&
      this.FechasObj.fechaInicio.getTime() < this.FechasObj.fechaFin.getTime()
    );
  }

  getTipoFecha(tipo: number): string {
    return this.tipoFechaList.find(tipofe => tipofe.tipofeId === tipo).tipofeNombre;
  }


  // RESTRICCIONES DE FECHA SEGÚN EL TIPO DE EVENTO
  onTipoChange(tipo: number) {

    if (tipo === 2) { // Ejecución
      const instalacionDate = this.fechasList.find(fecha => fecha.tipo === 1); // Buscar la etapa de montaje
      if (instalacionDate) {
        this.minDate = new Date(instalacionDate.fechaFin); // La fecha mínima para ejecución es la fecha fin de instalación

        // Crear hora mínima basada en la fecha fin de la instalación solo si es el mismo día
        if (this.isSameDay(this.minDate, this.FechasObj.fechaInicio)) {
          const horaInicioMin = instalacionDate.fechaFin.getHours().toString().padStart(2, '0') + ':' + instalacionDate.fechaFin.getMinutes().toString().padStart(2, '0');
          this.filtrarHorasDisponibles(horaInicioMin, 1);
        } else if(this.isSameDay(this.minDate, this.FechasObj.fechaFin)){
          const horaInicioMin = instalacionDate.fechaFin.getHours().toString().padStart(2, '0') + ':' + instalacionDate.fechaFin.getMinutes().toString().padStart(2, '0');
          this.filtrarHorasDisponibles(horaInicioMin, 2);
        } else {          
          this.limpiarRestriccionesHoras(); // Limpiar restricciones si es un día diferente
        }

        this.fechasDeshabilitadas = { fechaInicioDisabled: false, fechaFinDisabled: false };
      }
    } else if (tipo === 3) { // Desmontaje
      const ejecucionDate = this.fechasList.find(fecha => fecha.tipo === 2); // Buscar la etapa de ejecución
      if (ejecucionDate) {
        this.minDate = new Date(ejecucionDate.fechaFin); // La fecha mínima para desmontaje es la fecha fin de ejecución

        // Crear hora mínima basada en la fecha fin de la ejecución solo si es el mismo día
        if (this.isSameDay(this.minDate, this.FechasObj.fechaInicio)) {
          const horaInicioMin = ejecucionDate.fechaFin.getHours().toString().padStart(2, '0') + ':' + ejecucionDate.fechaFin.getMinutes().toString().padStart(2, '0');
          this.filtrarHorasDisponibles(horaInicioMin, 1);
        } else if(this.isSameDay(this.minDate, this.FechasObj.fechaFin)){
          const horaInicioMin = ejecucionDate.fechaFin.getHours().toString().padStart(2, '0') + ':' + ejecucionDate.fechaFin.getMinutes().toString().padStart(2, '0');
          this.filtrarHorasDisponibles(horaInicioMin, 2);
        } else {
          this.limpiarRestriccionesHoras(); // Limpiar restricciones si es un día diferente
        }

        this.fechasDeshabilitadas = { fechaInicioDisabled: false, fechaFinDisabled: false };
      }
    } else {
      // Si es Instalación o ninguna de las etapas finales
      this.minDate = new Date();  // Permitir desde hoy
      this.fechasDeshabilitadas = { fechaInicioDisabled: false, fechaFinDisabled: false };
      this.limpiarRestriccionesHoras(); // Limpiar restricciones por si acaso
    }
  }

  // Método para comparar si dos fechas son el mismo día
  isSameDay(date1: Date, date2: Date | undefined): boolean {
    if (!date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  // Método para filtrar las horas disponibles en base a la hora mínima permitida
  filtrarHorasDisponibles(horaMinima: string, tipo: number) {
    const index = this.timeList.indexOf(horaMinima);
    if (index !== -1) {
      // Recortar las listas de horas desde la hora mínima permitida
      if(tipo == 1){
        this.timeListFiltered1 = this.timeList.slice(index + 1);
      } else if(tipo == 2){
        this.timeListFiltered2 = this.timeList.slice(index + 1);
      }
    }
  }

  // Método para limpiar las restricciones de horas
  limpiarRestriccionesHoras() {
    this.timeListFiltered1 = [...this.timeList]; // Restaurar la lista completa de horas
    this.timeListFiltered2 = [...this.timeList];
  }


  idData = {
    solicitante: 0,
    tipoContrato: 0,
    localidad: 0,
    cliente: 0
  }

  async searchIdDataEvent() {
    console.log("Buscando ID de los datos del evento");

    const solicitante = this.empleadosList.find(emp => emp.empleadoNombres + ' ' + emp.empleadoApellidos === this.nombreEmpleado);

    const tipoContrato = this.tipoContratoList.find(cont => cont.contrId === this.gestEvento.tipoContrato);

    const localidad = this.localidadList.find(loc => loc.locNombre === this.nombreLocalidad);

    const cliente = this.clienteList.find(cli => cli.cliNombre === this.nombreCliente);
    console.log("Datos del evento", solicitante, tipoContrato, localidad, cliente);

    //validar que los inputs con autocomplete tengan un valor
    if (solicitante === undefined) {
      this.callMensaje("Seleccione un usuario solicitante", false);
      return false;

    } else if (tipoContrato === undefined) {
      this.callMensaje("Seleccione un tipo de contrato", false);
      return false;

    } else if (localidad === undefined) {
      this.callMensaje("Seleccione una localidad", false);
      return false;

    } else if (cliente === undefined) {
      this.callMensaje("Seleccione un cliente", false);
      return false;
    }

    this.idData = {
      solicitante: solicitante.empleadoIdNomina,
      tipoContrato: tipoContrato.contrId,
      localidad: localidad.locId,
      cliente: cliente.cliId
    }

    return true;
  }

  async validarCampos(): Promise<boolean> {
  const idValidos = await this.searchIdDataEvent();
    if (!idValidos) {
      return false;
    }

    //validar nombre, descripcion y tipo de pago
    if (this.gestEvento.nombreEvento === '') {
      this.callMensaje("Ingrese un nombre para el evento", false);
      return false;
    } else if (this.gestEvento.descripcion === '') {
      this.callMensaje("Ingrese una descripción para el evento", false);
      return false;
    } else if (this.gestEvento.tipoPago === 0) {
      this.callMensaje("Seleccione un tipo de pago", false);
      return false;
    } else if (this.gestEvento.tipoPago === 1 && this.gestEvento.pagoTotal === 0) {
      this.callMensaje("Ingrese un monto total", false);
      return false;
    } /*else if (this.gestEvento.tipoPago === 2) {
      if (this.gestEvento.pagoAbono === 0) {
        this.callMensaje("Ingrese un monto de abono", false);
        return false;
      } else if (this.gestEvento.pagoAbono > this.gestEvento.pagoTotal) {
        this.callMensaje("El monto de abono no puede ser mayor al monto total", false);
        return false
      }
    }*/

    //validaciones de las fechas
    console.log("Validando fechas", this.fechasList);
    if(!this.fechasList.some(fecha => fecha.tipo == 1)){
      this.callMensaje("Debe ingresar la fecha de montaje", false);
      return false;
    } else if(!this.fechasList.some(fecha => fecha.tipo == 2)){
      this.callMensaje("Debe ingresaar la fecha de ejecución", false);
      return false;
    } else if(!this.fechasList.some(fecha => fecha.tipo == 3)){
      this.callMensaje("Debe ingresar la fecha de desmontaje", false);
      return false;
    }

    return true;
  }

  //GUARDAR EL EVENTO
  async triggerSaveEvento() {
    //VALIDAR QUE LOS CAMPOS ESTEN LLENOS
    console.log("Validando campos");

    const camposValidos = await this.validarCampos();
    if (!camposValidos) {
      //this.callMensaje("Error: Complete todos los campos requeridos", false);
      return;
    }

    //console.log("Guardando evento");

    try {
      const evExito = await this.saveEvento();
      if (!evExito) {
        this.callMensaje("Error al guardar el evento", false);
        return;
      }

      // Obtén el ID del evento guardado
      const eventId = evExito; // Aquí obtienes el ID del evento desde el resultado de saveEvento

      const [fechaExito, cuotaExito] = await Promise.all([
        this.saveFecha(eventId),  // Pasa el ID del evento
        this.saveCuota(eventId)    // Pasa el ID del evento
      ]);

      if (fechaExito && cuotaExito) {
        this.callMensaje("Evento guardado con éxito", true);
      } else if (!fechaExito) {
        this.callMensaje("Error al guardar las fechas", false);
      } else if (!cuotaExito) {
        this.callMensaje("Error al guardar la cuota", false);
      }

    } catch (error) {
      console.error("Error en el proceso de guardado", error);
      this.callMensaje("Error en el proceso de guardado", false);
    }
  }

  async saveEvento(): Promise<number | false> {
    try {
      //const idData = this.searchIdDataEvent();
      const data = {
        evNombre: this.gestEvento.nombreEvento,
        evLocalidad: this.idData.localidad,
        evCliente: this.idData.cliente,
        evEstado: 10,
        evTipoContrato: this.idData.tipoContrato,
        evEmpleado: this.idData.solicitante,
        evPagoTotal: this.gestEvento.pagoTotal,
        evTipoPago: this.gestEvento.tipoPago,
        evDescripcion: this.gestEvento.descripcion,
        evEstadoValido: 1
      };

      //console.log("Guardando evento", data);

      const response = await this.fichaGestEvService.postFichaGestEvento(data).toPromise();
      console.log("Evento guardado", response.evId);
      return response.evId; // Devuelve el ID del evento guardado
    } catch (error) {
      console.error("Error al guardar el evento", error);
      return false; // Si hay un error, devuelve false
    }
  }

  async saveFecha(idEvento: number) {
    const promises = this.fechasList.map(async (fecha) => {
      const data = {
        fechaEvento: idEvento,
        fechaTipoFecha: fecha.tipo,
        fechaInicio: fecha.fechaInicio,
        fechaFin: fecha.fechaFin,
      };
     //console.log("Guardando fecha", data);
      try {
        const response = await this.fichaGestEvService.postFecha(data).toPromise();
        console.log("Fecha guardada", response);
        return true; // Retorna true si se guarda la fecha
      } catch (error) {
        console.error("Error al guardar la fecha", error);
        return false; // Retorna false si hay un error
      }
    });

    const results = await Promise.all(promises); // Espera a que todas las fechas se guarden
    return results.every(result => result); // Devuelve true solo si todas las fechas se guardaron con éxito
  }

  async saveCuota(idEvento: number) {
    let valor = this.gestEvento.tipoPago === 1 ? this.gestEvento.pagoTotal : this.gestEvento.pagoAbono;

    const data = {
      cuoIdEvento: idEvento,
      cuoTipoPago: this.gestEvento.tipoPago,
      cuoValor: valor,
      cuoFecha: new Date(),
    };

    try {
      const response = await this.fichaGestEvService.postCuotas(data).toPromise();
      console.log("Cuota guardada", response);
      return true; // Retorna true si se guarda la cuota
    } catch (error) {
      console.error("Error al guardar la cuota", error);
      return false; // Retorna false si hay un error
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  saveCliente() {
    //Guardar el cliente
    const data = {
      cliCodigo: "",
      cliNombre: this.cliente.clienteNombre,
      cliIdentificacion: this.cliente.cedula,
      cliDireccion: this.cliente.direccion,
      cliTelefono: this.cliente.telefono,
      cliEmail: this.cliente.correo
    }

    //console.log("Guardando cliente", data);

    this.fichaGestEvService.postClientes(data).subscribe(
      (response) => {
        console.log("Cliente guardado", response);
        this.dialog.closeAll();
        this.clearEventoData();
        this.fichaGestEvService.getClientesList().subscribe(
          (response) => {
            this.clienteList = _.cloneDeep(response);
            this.clienteListFiltered = _.cloneDeep(response);
          }
        )
      },
      (error) => {
        console.error("Error al guardar el cliente", error);
      }
    );
  }


}
