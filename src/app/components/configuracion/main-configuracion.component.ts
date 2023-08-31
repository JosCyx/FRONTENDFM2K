import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-main-configuracion',
  templateUrl: './main-configuracion.component.html',
  styleUrls: ['./main-configuracion.component.css']
})
export class MainConfiguracionComponent implements OnInit {

  ngOnInit(): void {
    // Inicializar el calendario cuando se cargue el componente
    //this.initializeCalendar();
  }

  /*initializeCalendar(): void {
    const calendarEl = document.getElementById('calendar');

    // Verificar si calendarEl no es null antes de usarlo
    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        events: [
          // Aquí puedes proporcionar tus eventos
          { title: 'Evento 1', date: '2023-09-01' },
          { title: 'Evento 2', date: '2023-09-15' },
          // ...
        ]
      });

      calendar.render();
    }
  }*/
}
