import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertEvent } from 'src/app/comint/models/AlertEvent';
import { AlertEventService } from 'src/app/services/comunicationAPI/comint/alert-event.service';
import { AuxComintService } from 'src/app/services/comunicationAPI/comint/aux-comint.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalComintService } from 'src/app/services/global-comint.service';

@Component({
  selector: 'app-alerta-evento',
  templateUrl: './alerta-evento.component.html',
  styleUrls: ['./alerta-evento.component.css']
})
export class AlertaEventoComponent {
  @ViewChild('fileInput') fileInput: any;

  alertEvento: AlertEvent = {
    altEvId: 0,
    altEvTipoAlerta: 0,
    altEvTituloAlerta: "",
    altEvImagenAlerta: "",
    altEvLugar: "",
    altEvEstado: 0,
    altEvEstadoEvento: 0,
    altEvFechaEvento: "",
    altEvHoraEvento: ""
  };

  evTypeList: any[] = [];
  fechainicio!: Date;
  fechaInicioStr: string = '';
  fechafin!: Date;
  imageAlert!: { file: File, url: string };
  imageBase64: string = '';
  isImageAlert: boolean = false;

  constructor(
    public globalComintService: GlobalComintService,
    private alertEventService: AlertEventService,
    private auxService: AuxComintService,
    private dialogService: DialogServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.globalComintService.editMode){
      this.alertEvento.altEvTituloAlerta = this.globalComintService.alertEvent.altEvTituloAlerta;
      this.alertEvento.altEvLugar = this.globalComintService.alertEvent.altEvLugar;
      this.alertEvento.altEvHoraEvento = this.globalComintService.alertEvent.altEvHoraEvento;
      this.alertEvento.altEvTipoAlerta = this.globalComintService.alertEvent.altEvTipoAlerta;
      this.fechaInicioStr = new Date(this.globalComintService.alertEvent.altEvFechaEvento).toISOString().split('T')[0];
      this.isImageAlert = true;
      this.imageAlert = { file: new File([], ''), url: 'data:image/jpeg;base64,' + this.globalComintService.alertEvent.altEvImagenAlerta };
      //this.imageBase64 =  'data:image/jpeg;base64,' + this.globalComintService.alertEvent.altEvImagenAlerta;

      //asignar las fechas de programacion a la lista
      if(this.globalComintService.alertEvent.altEvProgramacion != undefined){
        this.globalComintService.alertEvent.altEvProgramacion.forEach((p: any) => {
          this.dateEventList.push({ fecha: p.prAltFecha.split('T')[0], hora: p.prAltHora, envio: p.prEnviado });
        });
      }


    } else {
      //si se esta creando una alerta desde la pantalla de solicitud de evento se llenan los campos de la alerta
      if (this.globalComintService.makeAlert) {
        this.alertEvento.altEvTituloAlerta = this.globalComintService.alertInfo.titulo;
        this.alertEvento.altEvLugar = this.globalComintService.alertInfo.lugar;
        this.alertEvento.altEvHoraEvento = this.globalComintService.alertInfo.hora;
        //sumarle un dia a la fecha de inicio
        var fecha = this.globalComintService.alertInfo.fecha;
        //fecha.setDate(fecha.getDate() + 1);
        this.fechainicio = fecha;
      }
    }

    setTimeout(() => {
      this.loadData();
      //this.alertEvento = this.globalComintService.alertInfo;
    }, 100);
    //console.log('informacion para la alerta',this.globalComintService.alertInfo);
  }

  ngOnDestroy(): void {
    this.clearAlerta();
  }

  loadData() {
    this.auxService.getAlertTypes().subscribe(
      data => {
        //console.log('tipos de alertas', data);
        this.evTypeList = data;
      },
      error => {
        console.log("Error al consultar las actividades:", error);
      }
    );
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  //devuelve el nombre del tipo de actividad
  getTipoEvento(idEvento: number) {
      const tipo = this.evTypeList.find(tipo => tipo.typeAltId === idEvento);
      return tipo ? tipo.typeAltDescripcion : 'Actividad desconocida';
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    console.log("archivo seleccionado", selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {

        this.imageAlert = { file: selectedFile, url: e.target.result };

        this.fileInput.nativeElement.value = '';


        this.isImageAlert = true;
        console.log("nombre", selectedFile.name);
      };
      reader.readAsDataURL(selectedFile);
    }
    console.log('imagen seleccionada', this.imageAlert);
  }

  deleteImage() {
    //this.evidenciasList.splice(index, 1);
    //elimina la imagen seleccionada
    this.imageAlert = { file: new File([], ''), url: '' };
    this.isImageAlert = false;
    this.fileInput.nativeElement.value = '';
  }

  //desencadenar el guardado de la alerta
  saveAlert() {
    var savedAlert = 0;

    const alertData = {
      altEvTipoAlerta: this.alertEvento.altEvTipoAlerta,
      altEvTituloAlerta: this.alertEvento.altEvTituloAlerta,
      altEvImagenAlerta: '',
      altEvLugar: this.alertEvento.altEvLugar,
      altEvEstado: 1,
      altEvEstadoEvento: 1,
      altEvFechaEvento: this.fechainicio,
      altEvHoraEvento: this.alertEvento.altEvHoraEvento
    }

    console.log('datos de la alerta', alertData);

    this.alertEventService.addAlertEvent(alertData).subscribe(
      data => {
        //console.log('alerta guardada', data);
        savedAlert = data.id;
        if (savedAlert > 0) {
          this.saveImageAlert(savedAlert, this.alertEvento.altEvTituloAlerta);
        }
      },
      error => {
        console.log('error al guardar la alerta', error);
        this.callMensaje('Ha habido un error al guardar la alerta, por favor intente nuevamente.', false);
      }
    );
  }

  saveImageAlert(idAlert: number, asunto: string) {
    const formData = new FormData();
    formData.append('image', this.imageAlert.file);
    this.alertEventService.addImageAlertEvent(formData, idAlert, asunto, false, 0).subscribe(
      data => {
        //console.log('imagen guardada', data);
        this.saveAlertProgram(idAlert);
      },
      error => {
        console.log('error al guardar la imagen', error);
        this.callMensaje('Ha habido un error al guardar la imagen de la alerta, por favor intente nuevamente.', false);
      }
    );
  }

  saveAlertProgram(idAlert: number) {
    console.log("Guardando la programacion de la alerta");
    let exito = true;
    this.dateEventList.forEach((d) => {
      const data = {
        prAltIdAlerta: idAlert,
        prAltFecha: d.fecha,
        prAltHora: d.hora,
        prEnviado: 0,
        prAltEstado: 1
      }

      this.alertEventService.addProgramAlertEvent(data).subscribe(
        data => {
          exito = true;
          //console.log('programacion guardada', data);
        },
        error => {
          exito = false;
          console.log('error al guardar la programacion', error);
          this.callMensaje('Ha habido un error al guardar una fecha de programación, por favor intente nuevamente.', false);
        }
      );

    });

    if (exito) {
      this.callMensaje('La alerta ha sido programada correctamente.', true);
      this.router.navigate(['alertevlist']);
    }
  }

 

  saveOneAlertProgram() {
    //calcular la fecha y hora de los proximos 10 minutos enteros, ejemplo 10:30 o 10:40
    let fechaActual = new Date();
    let minutos = fechaActual.getMinutes();
    let hora = fechaActual.getHours();

    if (minutos > 50) {
      minutos = 0;
      hora++;
    } else {
      minutos = Math.ceil(minutos / 10) * 10;
    }

    fechaActual.setHours(hora);
    fechaActual.setMinutes(minutos);
    fechaActual.setSeconds(0);

    //agregar un elemento a la lista de programacion con esa fecha calculada
    let fechaCalculada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), hora, minutos);
    let fechaFormateada = fechaCalculada.toISOString().slice(0, 10);

    this.dateEventList.push({ fecha: fechaFormateada, hora: (hora < 10 ? '0' : '') + hora + ':' + (minutos < 10 ? '0' : '') + minutos, envio: 0 });

    //desencadenar la ejecucion del guardado de la alerta normalmente
    this.saveAlert();
  }

  //////////////////PROGRAMACION DE ALERTA//////////////////////
  timeList: string[] = [
    /*'00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
    '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
    '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
    '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
    '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
    '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
    '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
    '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
    '08:00', '08:10', '08:20', */
    '08:30', '08:40', '08:50',
    '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
    '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
    '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
    '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
    '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
    '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
    '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
    '17:00'
    /*, '17:10', '17:20', '17:30', '17:40', '17:50',
    '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
    '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
    '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
    '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
    '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
    '23:00', '23:10', '23:20', '23:30', '23:40', '23:50'*/
  ];

  //objeto que almacena la fecha y hora temporalmente
  dateEvent: { fecha: Date, hora: string } = { fecha: new Date(), hora: '08:30' };

  //lista que almacena todas las fechas y horas de la alerta
  dateEventList: { fecha: string, hora: string, envio: number }[] = [];

  addDateEvent() {
    //formatear la fecha a 2024-04-12
    const fechaFormato = this.formatDateToYYYYMMDD(new Date(this.dateEvent.fecha));

    this.dateEventList.push({ fecha: fechaFormato, hora: this.dateEvent.hora, envio: 0});
    this.dateEvent = { fecha: new Date(), hora: '08:30' };
  }

  deleteDateEvent(index: number) {
    this.dateEventList.splice(index, 1);
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  clearAlerta(){
    this.alertEvento = {
      altEvId: 0,
      altEvTipoAlerta: 0,
      altEvTituloAlerta: "",
      altEvImagenAlerta: "",
      altEvLugar: "",
      altEvEstado: 0,
      altEvEstadoEvento: 0,
      altEvFechaEvento: "",
      altEvHoraEvento: ""
    }
    this.fechainicio = new Date();
    this.fechafin = new Date();
    this.dateEventList = [];

    this.globalComintService.editMode = false;
    this,this.globalComintService.makeAlert = false;
    this.globalComintService.clearAlert();
    this.globalComintService.clearAlertInfo();
  }

  clearAndRedirect(){
    this.clearAlerta();
    this.router.navigate(['alertevlist']);
  }

  //EDICION

  updateAlert(){
    //limpiar todas las fechas de alertas anteriormente programadas
    this.clearAllAlerts(1);

    //guardar los cambios de la alerta (put)

  }

  

  updateImageAlert(idAlert: number, asunto: string, bkID: number){
    //guardar la imagen de la alerta
    const formData = new FormData();
    formData.append('image', this.imageAlert.file);
    this.alertEventService.addImageAlertEvent(formData, idAlert, asunto, true, bkID).subscribe(
      data => {
        //console.log('imagen guardada', data);
        this.saveAlertProgram(idAlert);
      },
      error => {
        console.log('error al guardar la imagen', error);
        this.callMensaje('Ha habido un error al guardar la imagen de la alerta, por favor intente nuevamente.', false);
      }
    );
  }

  //CREAR NUEVA PROPIEDAD DE ENVIADO EN LA PROGRAMACIÓN DE LA ALERTA
  clearAllAlerts(idAlert: number){
    //eliminar todas las alertas que tengan el id de la alerta y el estado 1 (cambiar estado a 0)
    this.dateEventList.forEach((d) => {
      const data = {
        prAltIdAlerta: idAlert,
        prAltFecha: d.fecha,
        prAltHora: d.hora,
        prEnviado: d.envio,
        prAltEstado: 0
      }

      this.alertEventService.addProgramAlertEvent(data).subscribe(
        data => {
          //console.log('programacion guardada', data);
        },
        error => {
          console.log('error al guardar la programacion', error);
          this.callMensaje('Ha habido un error al guardar una fecha de programación, por favor intente nuevamente.', false);
        }
      );
    });
  }

  //CORRECCION: crear una nueva lista para las alertas a eliminar y usar esa lista en el metodo clearAllAlerts, luego modificar el post para que verifique si es que ya existe un elemento antes de proceder a guardarlo, en caso de que exista no se hace nada pero si no existe procede a guardar el elemento en la base de datos para usar el mismo metodo de envio y guardar las nuevas fechas de la alerta
}
