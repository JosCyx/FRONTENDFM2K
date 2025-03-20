import { Component, ElementRef, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FichaGestEventoService } from 'src/app/services/comunicationAPI/gest-eventos/ficha-gest-evento.service';
import * as _ from 'lodash';
import { GlobalGestEventosService } from 'src/app/services/global-gest-eventos.service';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

interface Filter {
  key: any;
  value?: string;
  type: string;
}

interface Day {
  day: number;
  isToday?: boolean;
  belongsToCurrentMonth: boolean;
  events?: any[];
}

interface Evento {
  id: number;
  name: string;
  startdateF: Date;
  enddateF: Date;
  startdateS: Date;
  enddateS: Date;
  startdateT: Date;
  enddateT: Date;
  contrato: number;
  estadop: number;
  espacio: number;
  icon: string;
}

@Component({
  selector: 'app-calendario-evento-gest',
  templateUrl: './calendario-evento-gest.component.html',
  styleUrls: ['./calendario-evento-gest.component.css']
})
export class CalendarioEventoGestComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  days: Day[] = []; 
  daysOfWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  currentDay: Date = new Date();
  currentMonth: number = this.currentDay.getMonth();
  currentYear: number = this.currentDay.getFullYear();

  localidadListFiltered: any[] = [];
  localidadList: any[] = [];
  nombreLocalidad: number = 0;

  events: Evento[] = []
  eventsBackup: Evento[] = [];
  eventsBackupFiltered: Evento[] = [];

  eventoSelected: any = {};

  grayIcons: any[] = [];

  constructor(
    private dialog: MatDialog,
    private gestEvService: FichaGestEventoService,
    private globalEvGestService: GlobalGestEventosService,
    private router: Router,
    private announcer: LiveAnnouncer,
    private dialogService: DialogServiceService
  ) { }


  ngOnInit(): void {

    setTimeout(() => {

      this.gestEvService.GetTpIconsList('G').subscribe(
        response => {
          this.grayIcons = _.cloneDeep(response);
        },
        error => {
          console.error(error);
        }
      );

      this.gestEvService.getLocalidadLista().subscribe(
        response => {
          this.localidadList = _.cloneDeep(response);
          this.localidadListFiltered = _.cloneDeep(response);
        },
        error => {
          console.error(error);
        }
      );

      this.gestEvService.getCalendarData().subscribe(
        (data: any) => {
          console.log("Data: ", data);

          this.events = data.map((item: any) => ({
            id: item.id,
            name: item.nombre,
            startdateF: new Date(item.startdateF),
            enddateF: new Date(item.enddateF),
            startdateS: new Date(item.startdateS),
            enddateS: new Date(item.enddateS),
            startdateT: new Date(item.startdateT),
            enddateT: new Date(item.enddateT),
            contrato: item.contrato,
            estadop: item.estadop,
            espacio: item.espacio,
            icon: item.icono
          }));

          //creamos una copia de los datos originales
          this.eventsBackup = _.cloneDeep(this.events);
          //console.log("EventosBK: ", this.eventsBackup);
          this.handleFilterByState(3);
          console.log("Eventos: ", this.events);
          this.generateCalendar();
        },
        (error: any) => {
          console.error(error);
        }
      );
    }, 300);
  } 

  generateCalendar(): void {
    //console.log("GENERANDO CALENDARIO...");
    this.days = [];
    const today = new Date();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const numberOfDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Obtener el último día del mes anterior
    const lastDayOfPreviousMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    // Rellenar los días iniciales con los días del mes anterior
    for (let i = startingDay - 1; i >= 0; i--) {

      this.days.push({ day: lastDayOfPreviousMonth - i, belongsToCurrentMonth: false });
    }

    // Rellenar los días del mes actual
    for (let i = 1; i <= numberOfDays; i++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, i);
      const eventsForDay = this.getEventsForDay(currentDate);
      this.days.push({ day: i, belongsToCurrentMonth: true, events: eventsForDay, isToday: this.isSameDay(currentDate, today) });
    }

    // Rellenar los días finales con los días del mes siguiente
    const remainingDays = 42 - this.days.length; // 6 filas * 7 días por fila
    for (let i = 1; i <= remainingDays; i++) {

      this.days.push({ day: i, belongsToCurrentMonth: false });
    }
  }

  getMonthName(month: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[month];
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  getEventsForDay(date: Date): any[] {
    // Lista que almacenará los eventos del día actual
    const eventsForDay: any[] = [];

    // Itera sobre todos los eventos disponibles (almacenados en this.events)
    this.events.forEach(event => {
      const eventTypes: string[] = [];

      // Verifica si la fecha actual está dentro del rango de fechas del montaje
      if (date >= event.startdateF && date <= event.enddateF) {
        eventTypes.push('Montaje');
      }

      // Verifica si la fecha actual está dentro del rango de fechas de la ejecución
      if (date >= event.startdateS && date <= event.enddateS) {
        eventTypes.push('Ejecución');
      }

      // Verifica si la fecha actual está dentro del rango de fechas del desmontaje
      if (date >= event.startdateT && date <= event.enddateT) {
        eventTypes.push('Desmontaje');
      }

      // Si hay algún tipo de evento para este día, agregar el evento completo con el tipo de evento
      if (eventTypes.length > 0) {
        eventsForDay.push({
          ...event, // Mantiene todas las propiedades originales del evento
          eventType: eventTypes.join(' - ') // Concatenar los tipos de eventos con guión
        });
      }
    });

    //console.log("Eventos del día: ", date, eventsForDay);
    return eventsForDay;
  }

  showEventDetails(event: any): void {
    this.gestEvService.getOneEventData(event.id).subscribe(
      (data: any) => {
        //console.log("Evento encontrado: ", data);
        this.eventoSelected = data[0];

        this.dialog.open(this.dialogTemplate, {
          width: '80%',
          height: '99%',
        });

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  closeEvDialog() {
    this.dialog.closeAll();
  }

  sendEstadoToHandle(event: any) {
    this.handleFilterByState(event.value);
  }

  //filtrar eventos por estado
  handleFilterByState(estado: number): void {
    if (estado == 1) {
      //mostrar todos los eventos
      this.events = _.cloneDeep(this.eventsBackup);
      this.eventsBackupFiltered = _.cloneDeep(this.events);
      this.nombreLocalidad = 0;
      this.applyFilter();
    } else if (estado == 2) {
      //filtrar por estado 20 - Solicitado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 20));
      this.eventsBackupFiltered = _.cloneDeep(this.events);
      this.nombreLocalidad = 0;
      this.applyFilter();
    } else if (estado == 3) {
      //filtrar por estado 30 - Aprobado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 30));
      this.eventsBackupFiltered = _.cloneDeep(this.events);
      this.nombreLocalidad = 0;
      this.applyFilter();
    } else if (estado == 4) {
      //filtrar por estado 40 - Finalizado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 40));
      this.eventsBackupFiltered = _.cloneDeep(this.events);
      this.nombreLocalidad = 0;
      this.applyFilter();
    }
  }

  selectEvent(idEvent: number) {
    this.closeEvDialog();
    this.globalEvGestService.idEventoSelected = idEvent;
    this.globalEvGestService.editMode = true;

    this.router.navigate(['addEventoGest']);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  getLugaresList(lugar: string): string[] {
    if (!lugar) return [];
    return lugar.split(',').map(item => item.trim());
  }

  /////////////////////////////////////////////////////////////////filtro de eventos///////////////////////////////////////////////////////////
  paramFilterList: Filter[] = [];

  filterSuscription!: Subscription;

  filterEvent(type: string) {
    //Comprobación de existencia de suscripción antes de crear una nueva
    if (this.filterSuscription && !this.filterSuscription.closed) {
      this.filterSuscription.unsubscribe();
    }

    this.dialogService.openFilterDialog(type);

    this.filterSuscription = this.dialogService.paramFilterSubject.subscribe(
      (filtro: Filter) => {
        this.paramFilterList.push(filtro);
        this.applyFilter();

        //desuscribirse del observable
        this.filterSuscription.unsubscribe();
      }
    );
  }

  applyFilter() {
    //hacer una copia de los eventos filtrados
    let filteredEvents = _.cloneDeep(this.eventsBackupFiltered);
    
    this.paramFilterList.forEach((filtro: Filter) => {
      switch (filtro.type) {
        case "tipo de contrato":
          //console.log("Filtrando por contrato: ", filtro.key);
          filteredEvents = filteredEvents.filter((ev: any) => ev.contrato == filtro.key);
          //console.log("Eventos filtrados: ", this.events);
          break;
        case "espacio":
          //console.log("Filtrando por espacio: ", filtro.key);
          filteredEvents = filteredEvents.filter((ev: any) => ev.espacio.includes(filtro.key));
          //console.log("Eventos filtrados: ", this.events);
          break;
        default:
          break;
      }
    });

    this.events = _.cloneDeep(filteredEvents);
    this.generateCalendar();
  }

  remove(filter: any): void {
    const index = this.paramFilterList.indexOf(filter);

    if (index >= 0) {
      this.paramFilterList.splice(index, 1);
      this.announcer.announce(`Removed ${filter.name}`);
    }

    //si no existe un filtro de tipo de contrato, setear como 0 la variable global
    if (!this.verifyFilterExist('tipo de contrato')) {
      this.globalEvGestService.idTipoContratoSelected = 0;
    }

    this.applyFilter();
  }

  verifyFilterExist(type: string): boolean {
    return this.paramFilterList.some((filter: any) => filter.type === type)
  }

  resetFilter() {
    this.globalEvGestService.idTipoContratoSelected = 0;
    this.paramFilterList = [];
    this.events = _.cloneDeep(this.eventsBackup);
    this.generateCalendar();
    this.handleFilterByState(3);
  }
}
