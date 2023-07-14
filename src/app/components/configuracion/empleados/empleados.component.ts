import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {
  empleadoId: number = 0;
  empleadoNombres: string = '';
  empleadoApellidos: string = '';
  empleadoIdentificacion: string = '';
  empleadoCorreo: string = '';
  empleadoDpto: number = 0;


  changeview: string = 'consulta';
  edicion: boolean = false;
  mensajeExito: string = '';

  empleadoList$!: Observable<any[]>;
  dptoList$!: Observable<any[]>;

  constructor(private service: CommunicationApiService) {}

  ngOnInit() {
    this.empleadoList$ = this.service.getEmpleadosList();
    this.dptoList$ = this.service.obtenerDepartamento();
  }

  editar(view: string): void {
    this.changeview = view;
    this.edicion = true;
  }

  changeView(view: string): void {
    this.changeview = view;
    this.edicion = false;

  }

  cancelar(): void {
    this.empleadoNombres = '';
    this.empleadoApellidos = '';
    this.empleadoCorreo = '';
    this.empleadoIdentificacion = '';
    this.empleadoDpto = 0;

    this.changeview = 'consulta';
  }

  editarEmpleado(id:number){
    this.empleadoId = id;

    this.service.getEmpleadoById(this.empleadoId).subscribe(
      response => {
        this.empleadoNombres = response.empleadoNombres;
        this.empleadoApellidos = response.empleadoApellidos;
        this.empleadoIdentificacion = response.empleadoIdentificacion;
        this.empleadoCorreo = response.empleadoCorreo;
        this.empleadoDpto = response.empleadoIdDpto;
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error:', error);
      }
    );
    // Cambiar la variable de vista para mostrar la pantalla de edición
    this.changeview = 'editar';
  }
  
  guardarEdicion(): void {
    const data = {

      
    };
  
    // Llamar al método updateRols() del servicio para enviar los datos actualizados a la API
    this.service.updateEmpelado(this.empleadoId, data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Empleado actualizado exitosamente:', response);
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error:', error);
      }
    );
    //muestra mensaje de exito y redirige a la otra vista luego de 1 segundo
    this.mensajeExito = 'Empleado editado exitosamente.';
    setTimeout(() => {
      // Restablecer las variables locales a sus valores iniciales
      this.empleadoNombres = '';
      this.empleadoApellidos = '';
      this.empleadoCorreo = '';
      this.empleadoIdentificacion = '';
      this.empleadoDpto = 0;
      this.changeview = 'consulta';
      }, 1000);
  }
}


