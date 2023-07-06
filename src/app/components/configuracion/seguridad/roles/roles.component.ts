import { Component } from '@angular/core';
import { Rol } from 'src/app/models/Rol';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  codigo: string = '';
  nombre: string = '';
  aplicacion: string = '';
  estado: string = '';

  listaRoles: Rol[] = [];

  agregarRol():void{
    const rol: Rol = {
      codigo: this.codigo,
      nombre: this.nombre,
      aplicacion: this.aplicacion,
      estado: this.estado
    }

    this.listaRoles.push(rol);
  
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';
  }

  eliminarRol(index:number):void{
    this.listaRoles.splice(index,1);
  }


}
