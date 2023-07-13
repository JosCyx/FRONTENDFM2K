import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/models/seguridad/Rol';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  //variables para guardar los datos del rol nuevo
  nombre: string = '';
  aplicacion: string = '';//hay que borrar
  idAplicacion: number = 0;
  estado: string = '';

  codigo: string = '';

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  edicion: boolean = false;
  roCodigo: number = 0;
  mensajeExito: string = '';

  activeStatus: boolean = false;

  //listas
  rolList$!: Observable<any[]>;
  appsList$!: Observable<any[]>;

  // Map to display data associate with foreign keys
  rolsMap: Map<number, string> = new Map()

  constructor(private service: CommunicationApiService) { }

  ngOnInit() {
    this.rolList$ = this.service.getRolsList();
    this.appsList$ = this.service.getAplicacionesList();
  }

  agregarRol(): void {
    // Crear el objeto JSON con los datos del rol
    const data = {
      roEmpresa: 1, // define el valor por defecto de la empresa 
      roNombre: this.nombre,
      roEstado: this.estado,
      roAplicacion: this.idAplicacion
    };

    // Llamar al método addRols() del servicio para enviar los datos a la API
    this.service.addRols(data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Rol agregado exitosamente:', response);
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al agregar el rol:', error);
      }
    );

    //muestra mensaje de exito y redirige a la otra vista luego de 1 segundo
    this.mensajeExito = 'Rol registrado exitosamente.';
    setTimeout(() => {
      this.mensajeExito = '';
      this.changeview = 'consulta';
      }, 1000);
  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
    this.codigo = '';
    this.nombre = '';
    this.aplicacion = '';
    this.estado = '';

    this.changeview = view;
    this.edicion = false;

  }

  //cambia la vista a "consulta" para listar los roles registrados y define la variable edicion como true para mostrar la columna de edicion
  editar(view: string): void {
    this.changeview = view;
    this.edicion = true;
  }

  //resetea las variables a valores vacios y cambia la variable de vista para mostrar la lista de roles 
  cancelar(): void {
    this.codigo = '';
    this.nombre = '';
    this.idAplicacion = 0;
    this.estado = '';

    this.changeview = 'consulta';
  }

  editarRol(index: number): void {
    // Guardar el valor de la posición del elemento a editar
    this.roCodigo = index;
  
    // Llamar al método getRolById() del servicio para obtener el rol por su código
    this.service.getRolById(this.roCodigo).subscribe(
      response => {
        // Asignar los valores del rol obtenido a las variables locales
        this.codigo = response.roCodigo;
        this.nombre = response.roNombre;
        this.idAplicacion = response.roAplicacion;
        this.estado = response.roEstado;
  
        
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al obtener el rol:', error);
      }
    );
    // Cambiar la variable de vista para mostrar la pantalla de edición
    this.changeview = 'editar';
  }
  

  // editarRol(rol: Rol, index: number): void {
  //   //guarda el valor de la posicion del elemento a editar
  //   this.roCodigo = index;

  //   // Asignar los valores del objeto rol a las propiedades existentes
  //   this.codigo = rol.codigo;
  //   this.nombre = rol.nombre;
  //   this.aplicacion = rol.aplicacion;
  //   this.estado = rol.estado;

  //   //cambia la variable de vista para mostrar la pantalla de edicion
  //   this.changeview = 'editar';
  // }
  

  //LISTAS DONDE SE GUARDAN LOS ROLES
  //listaRoles: Rol[] = [];

  //elimina el elemento en la posicion indicada por "index" de la lista de roles 
  eliminarRol(index: number): void {
    //this.listaRoles.splice(index, 1);
  }


  guardarEdicion(): void {
    const data = {
      roEmpresa: 1, // Ajusta el valor según tus requisitos
      roNombre: this.nombre,
      roEstado: this.estado,
      roAplicacion: this.idAplicacion // Ajusta el valor según tus requisitos
    };
  
    // Obtener el código del rol a actualizar
    this.rolList$.subscribe((roles: Rol[]) => {
      const codigoRol = roles[this.roCodigo].codigo;
  
      // Llamar al método updateRols() del servicio para enviar los datos actualizados a la API
      this.service.updateRols(codigoRol, data).subscribe(
        response => {
          // Manejar la respuesta de la API aquí si es necesario
          console.log('Rol actualizado exitosamente:', response);
  
          // Actualizar la lista de roles después de la edición
          this.rolList$ = this.service.getRolsList();
  
          // Restablecer las variables locales a sus valores iniciales
          this.codigo = '';
          this.nombre = '';
          this.aplicacion = '';
          this.estado = '';
  
          // Cambiar la vista de nuevo a la lista de roles
          this.changeview = 'consulta';
        },
        error => {
          // Manejar cualquier error que ocurra durante la llamada a la API aquí
          console.error('Error al actualizar el rol:', error);
        }
      );
    });
  }
  
  
  
  


  // guardarEdicion(): void {

  //   // Crear un nuevo objeto de tipo Rol con los valores de las propiedades existentes
  //   const rolEditado: Rol = {
  //     codigo: this.codigo,
  //     nombre: this.nombre,
  //     aplicacion: this.aplicacion,
  //     estado: this.estado
  //   };

  //   // Reemplazar el elemento en la posición index de la listaRoles con el rol editado
  //   this.listaRoles.splice(this.indice, 1, rolEditado);

  //   // Restablecer los valores de las propiedades
  //   this.codigo = '';
  //   this.nombre = '';
  //   this.aplicacion = '';
  //   this.estado = '';

  //   //cambia la variable de vista para mostrar la lista de roles
  //   this.edicion = false;
  //   this.changeview = 'consulta';
  // }

}
