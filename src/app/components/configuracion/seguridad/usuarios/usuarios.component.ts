import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/seguridad/Usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  user: string = '';
  pass: string = '';
  nombre: string = '';
  estado: string = '';
  fechaInicio: Date = new Date;
  fechaFin: Date = new Date;

  changeview: string = 'registro'; 


  changeView(view: string): void {
    this.changeview = view;
  }
}
