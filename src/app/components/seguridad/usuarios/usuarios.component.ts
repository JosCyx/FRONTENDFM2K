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
    const usuario: Usuario = {
      user: this.user,
      pass: this.pass,
      nombre: this.nombre,
      estado: this.estado,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    }

    this.listUsers.push(usuario);
  
    //resetea las variables para que no muestren contenido en la vista
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';
    this.fechaInicio = new Date;
    this.fechaFin = new Date;

    //regresa a la vista consulta donde se muestran todos los roles
    this.changeview= 'consulta';
  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';
    this.fechaInicio = new Date;
    this.fechaFin = new Date;
    
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