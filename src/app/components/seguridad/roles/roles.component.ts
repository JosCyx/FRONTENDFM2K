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

 
  //agrega un nuevo rol a la lista
  agregarRol():void{
    const rol: Rol = {
      codigo: this.codigo,
      nombre: this.nombre,
      aplicacion: this.aplicacion,
      estado: this.estado
    }

    this.listaRoles.push(rol);
  
    //resetea las variables para que no muestren contenido en la vista
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';

    //regresa a la vista consulta donde se muestran todos los roles
    this.changeview= 'consulta';
  }

  //elimina el elemento en la posicion indicada por "index" de la lista de roles 
  eliminarRol(index:number):void{
    this.listaRoles.splice(index,1);
  }


  editarRol(rol: Rol, index: number): void {
    //guarda el valor de la posicion del elemento a editar
    this.indice = index;

    // Asignar los valores del objeto rol a las propiedades existentes
    this.codigo = rol.codigo;
    this.nombre = rol.nombre;
    this.aplicacion = rol.aplicacion;
    this.estado = rol.estado;

    //cambia la variable de vista para mostrar la pantalla de edicion
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

    //cambia la variable de vista para mostrar la lista de roles
    this.edicion = false;
    this.changeview = 'consulta';
  }
  

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.changeview = view;
    this.edicion = false;
    
  }
  editar(view:string):void{
    this.changeview = view;
    this.edicion = true;
  }

  //resetea las variables a valores vacios y cambia la variable de vista para mostrar la lista de roles 
  cancelar():void{
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';

    this.changeview = 'consulta';

  }
}
