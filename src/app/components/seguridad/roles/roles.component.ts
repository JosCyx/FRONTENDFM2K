import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  //variables para guardar los datos del rol nuevo
  roCodigo: number = 0;//almacena el id del rol que se seleccione
  nombre: string = '';
  idAplicacion: number = 0;
  estado: string = '';

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  edicion: boolean = false;
  mensajeExito: string = '';
  count: number = 0;

  updateCount(): void {
    this.count++;
  }

  //listas
  rolList$!: Observable<any[]>;
  appsList$!: Observable<any[]>;

  // Map to display data associate with foreign keys
  //rolsMap: Map<number, string> = new Map()

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
    this.nombre = '';
    this.idAplicacion = 0;
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
    this.nombre = '';
    this.idAplicacion = 0;
    this.estado = '';

    this.changeview = 'consulta';
  }

  //recibe el id del rol y lo guarda en una variable local y trae los datos de dicho rol desde la API para cargarlos en las variables locales
  editarRol(index: number): void {
    // Guardar el valor de la posición del elemento a editar
    this.roCodigo = index;
  
    // Llamar al método getRolById() del servicio para obtener el rol por su código
    this.service.getRolById(this.roCodigo).subscribe(
      response => {
        // Asignar los valores del rol obtenido a las variables locales
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

    //guarda los datos almacenados en las variables locales en un data y los envia a la api con el metodo updateRols
  guardarEdicion(): void {
    const data = {
      roEmpresa: 1, // Ajusta el valor según tus requisitos
      roCodigo:this.roCodigo,
      roNombre: this.nombre,
      roEstado: this.estado,
      roAplicacion: this.idAplicacion // Ajusta el valor según tus requisitos
    };
  
    // Llamar al método updateRols() del servicio para enviar los datos actualizados a la API
    this.service.updateRols(this.roCodigo, data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Rol actualizado exitosamente:', response);
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al actualizar el rol:', error);
      }
    );
    //muestra mensaje de exito y redirige a la otra vista luego de 1 segundo
    this.mensajeExito = 'Rol editado exitosamente.';
    setTimeout(() => {
      // Restablecer las variables locales a sus valores iniciales
      this.nombre = '';
      this.idAplicacion = 0;
      this.estado = '';
      this.mensajeExito = '';
      this.changeview = 'consulta';
      }, 1000);
  }
  
}
