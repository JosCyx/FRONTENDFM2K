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

  confirmPass: string = '';
  changeview: string = 'consulta'; 

  listUsers: Usuario [] = [];


  //añade un nuevo usuario a la listUsers
  agregarUsuario(){

  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.changeview = view;
  }

  //resetea las variables a valores vacios y cambia la variable de vista para mostrar la lista de roles 
  cancelar():void{
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';

    this.changeview = 'consulta';

  }
}

//[disabled]="!edicion"