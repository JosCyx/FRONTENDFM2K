import { Component } from '@angular/core';
import { Solicoti } from 'src/app/models/procesos/solicoti';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent {
  empleado: string = '';
  fecha: Date = new Date;

  changeview: string = 'crear';

  
  changeView(view: string): void {
    this.changeview = view;
  }

}