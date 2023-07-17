import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {
  empId: number = 0;
  empNombres: string = '';
  empApellidos: string = '';
  empIdentificacion: string = '';
  empCorreo: string = '';
  empDpto: number = 0;
  empTipoId: number = 0;
  empSexo: string = '';
  empTelefono: string = '';


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

  //limpia las variables y regresa a la vista de consultar
  cancelar(): void {
    this.empNombres = '';
      this.empApellidos = '';
      this.empCorreo = '';
      this.empIdentificacion = '';
      this.empDpto = 0;
      this.empId = 0;
      this.empSexo = '';
      this.empTelefono = '';
      this.empTipoId = 0;

    this.changeview = 'consulta';
  }

  editarEmpleado(id:number){
    this.empId = id;

    this.service.getEmpleadoById(this.empId).subscribe(
      response => {
        //aunque no se muestren en pantalla todas, guardamos todos los datos que trae nuestra tabla en variables locales para luego usarlas al enviar el put
        this.empNombres = response.empleadoNombres;
        this.empApellidos = response.empleadoApellidos;
        this.empIdentificacion = response.empleadoIdentificacion;
        this.empCorreo = response.empleadoCorreo;
        this.empDpto = response.empleadoIdDpto;
        this.empTipoId = response.empleadoTipoId;
        this.empSexo = response.empleadoSexo;
        this.empTelefono = response.empleadoTelefono;
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
    //es necesario enviar todos los campos cuando se realiza u put (edicion), de lo contrario retornara errores
    const data = {
      empleadoId: this.empId,
      empleadoIdDpto: this.empDpto,
      empleadoCompania: 1,
      empleadoTipoId: this.empTipoId,
      empleadoIdentificacion: this.empIdentificacion,
      empleadoNombres: this.empNombres,
      empleadoApellidos: this.empApellidos,
      empleadoSexo: this.empSexo,
      empleadoTelefono: this.empTelefono,
      empleadoCorreo: this.empCorreo
    };
  
    // Llamar al método updateRols() del servicio para enviar los datos actualizados a la API
    this.service.updateEmpelado(this.empId, data).subscribe(
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
      this.empNombres = '';
      this.empApellidos = '';
      this.empCorreo = '';
      this.empIdentificacion = '';
      this.empDpto = 0;
      this.empId = 0;
      this.empSexo = '';
      this.empTelefono = '';
      this.empTipoId = 0;

      this.changeview = 'consulta';
      }, 1000);
  }
}

