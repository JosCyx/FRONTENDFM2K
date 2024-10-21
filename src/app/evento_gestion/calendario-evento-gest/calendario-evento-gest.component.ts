import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario-evento-gest',
  templateUrl: './calendario-evento-gest.component.html',
  styleUrls: ['./calendario-evento-gest.component.css']
})
export class CalendarioEventoGestComponent {
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  selectedDay: Date | null = null;
  
  // Eventos ingresados a través del formulario
  eventos: any[] = [
    {
      nombreEvento: 'Concierto' + '\nFeria',
      tipoEvento: 'Musical',
      estado: 'Activo',
      espacio: 'Auditorio',
      cliente: 'Cliente A',
      fechaInicio: new Date(2024, 9, 19),
      fechaFin: new Date(2024, 9, 19)
    }
    // Se pueden agregar más eventos aquí
  ];

  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Obtiene todos los días del mes
  getDaysInMonth(month: number, year: number): Date[] {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  // Comprueba si un día tiene un evento asociado
  hasEvent(date: Date): boolean {
    return this.eventos.some(evento =>
      date >= evento.fechaInicio && date <= evento.fechaFin
    );
  }

  // Obtiene los detalles del evento para un día dado
  getEvent(date: Date): any {
    return this.eventos.find(evento =>
      date >= evento.fechaInicio && date <= evento.fechaFin
    );
  }

  // Seleccionar mes anterior
  prevMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
  }

  // Seleccionar mes siguiente
  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
  }

  // Seleccionar un día en el calendario
  selectDay(day: Date) {
    this.selectedDay = day;
    // Lógica adicional cuando se selecciona un día (si es necesario)
  }
}
