import { Component } from '@angular/core';
import { Rol } from 'src/app/models/seguridad/Rol';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  //PROPIEDADES DE LOS ROLES
  codigo: string = '';
  nombre: string = '';
  aplicacion: string = '';
  estado: string = '';

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  edicion: boolean = false;
  indice: number = 0;

  //LISTAS DONDE SE GUARDAN LOS ROLES
  listaRoles: Rol[] = [];

 

  agregarRol():void{//agrega un nuevo rol a la lista
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

    this.changeview= 'consulta';//regresa a la vista consulta donde se muestran todos los roles
  }

  eliminarRol(index:number):void{
    this.listaRoles.splice(index,1);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  editarRol(rol: Rol, index: number): void {
    this.indice = index;

    // Asignar los valores del objeto rol a las propiedades existentes
    this.codigo = rol.codigo;
    this.nombre = rol.nombre;
    this.aplicacion = rol.aplicacion;
    this.estado = rol.estado;

    this.edicion = true;
    this.changeview = 'editar';
  }
  

  guardarEdicion(): void {

    // Crear un nuevo objeto de tipo Rol con los valores de las propiedades existentes
    const rolEditado: Rol = {
      codigo: this.codigo,
      nombre: this.nombre,
      aplicacion: this.aplicacion,
      estado: this.estado
    };

    // Reemplazar el elemento en la posición index de la listaRoles con el rol editado
    this.listaRoles.splice(this.indice, 1, rolEditado);

    // Restablecer los valores de las propiedades
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';

    this.edicion = false;
    this.changeview = 'consulta';
  }
  

  changeView(view: string): void {//controla la vista de las diferentes partes
    this.changeview = view;
  }

  cancelar():void{
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';

    this.changeview = 'consulta';

  }
}
