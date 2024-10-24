import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FichaGestEventoService } from 'src/app/services/comunicationAPI/gest-eventos/ficha-gest-evento.service';
import * as _ from 'lodash';

interface Day {
  day: number;
  belongsToCurrentMonth: boolean;
  events?: any[]; // Agrega esta propiedad
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
}

@Component({
  selector: 'app-calendario-evento-gest',
  templateUrl: './calendario-evento-gest.component.html',
  styleUrls: ['./calendario-evento-gest.component.css']
})
export class CalendarioEventoGestComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  days: Day[] = []; // Usa la interfaz Day
  daysOfWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  currentDay: Date = new Date();
  currentMonth: number = this.currentDay.getMonth();
  currentYear: number = this.currentDay.getFullYear();

  //eventos por dia
  /*events: Evento[] = [
    { name: 'Evento 1', startdate: new Date(2024, 9, 8), isMultiDay: false},
    { name: 'Evento 1.1', date: new Date(2024, 9, 8), isMultiDay: false},
    { name: 'Evento 1.2', date: new Date(2024, 9, 8), isMultiDay: false, startTime: '8:00', durationHours: 999 },
    { name: 'Evento 1.3', date: new Date(2024, 9, 8), isMultiDay: false, startTime: '8:00', durationHours: 999 },
    { name: 'Evento 1.4', date: new Date(2024, 9, 8), isMultiDay: false, startTime: '8:00', durationHours: 999 },
    { name: 'Evento 2', date: new Date(2024, 9, 15), isMultiDay: false, startTime: '12:00', durationHours: 2 },
    { name: 'Evento numero 3 en la sala norte', date: new Date(2024, 9, 8), isMultiDay: true, duration: 3, startTime: '10:00', durationHours: 2 },
    // Agrega más eventos según sea necesario
  ];*/

  events: Evento[] = []
  eventsBackup: Evento[] = [];

  eventoSelected: any = {};

  constructor(
    private dialog: MatDialog,
    private gestEvService: FichaGestEventoService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.gestEvService.getCalendarData().subscribe(
        (data: any) => {

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
            estadop: item.estadop
          }));

          //creamos una copia de los datos originales
          this.eventsBackup = _.cloneDeep(this.events);

          this.handleFilterByState(3);

          //console.log("Eventos: ", this.events);
          this.generateCalendar();
        },
        (error: any) => {
          console.error(error);
        }
      );
    }, 300);
  }

  generateCalendar(): void {
    this.days = [];
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
      this.days.push({ day: i, belongsToCurrentMonth: true, events: eventsForDay });
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

  //obtener eventos de cada dia
  /*getEventsForDay(date: Date): Evento[] {
    return this.events.filter(event => {
      return date >= event.startdate && date <= event.enddate; // Filtrar eventos que abarquen el día actual
    });
  }*/

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
    //consultar el evento seleccionado
    //console.log("Evento seleccionado: ", event);

    this.gestEvService.getOneEventData(event.id).subscribe(
      (data: any) => {
        //console.log("Evento encontrado: ", data);
        this.eventoSelected = data[0];

        this.dialog.open(this.dialogTemplate, {
          width: '65%'
        });

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  closeEvDialog(){
    this.dialog.closeAll();
  }

  sendEstadoToHandle(event: any){
    //console.log("Estado seleccionado: ", event.value);
    this.handleFilterByState(event.value);
  }

  //filtrar eventos por estado
  handleFilterByState(estado: number): void {

    if (estado == 1){
      //mostrar todos los eventos
      this.events = _.cloneDeep(this.eventsBackup);
      this.generateCalendar();
    } else if (estado == 2){
      //filtrar por estado 20 - Solicitado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 20));
      this.generateCalendar();
    } else if (estado == 3){
      //filtrar por estado 30 - Aprobado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 30));
      this.generateCalendar();
    } else if (estado == 4) {
      //filtrar por estado 40 - Finalizado
      this.events = _.cloneDeep(this.eventsBackup.filter((ev: any) => ev.estadop == 40));
      this.generateCalendar();
    }
  }

}
