import { Component, OnInit } from '@angular/core';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { Observable, map } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  //variables que almacenan el contenido de la tabla empleados tenporalmente y nos sirve para editarlos
  empId: number = 0;
  empIdNomina: number = 0;
  empNombres: string = '';
  empApellidos: string = '';
  empIdentificacion: string = '';
  empCorreo: string = '';
  empArea: number = 0;
  empDpto: number = 0;
  empTipoId: string = '';
  empSexo: string = '';
  empTelefono: string = '';
  empEstado: string = '';

  //almacena el id del area al que pertenece un departamento
  areaDpto: number = 0;

  //variables para controlar las funciones de la pagina
  changeview: string = 'consulta';
  edicion: boolean = false;
  mensajeExito: string = '';
  currentPage: number = 1 ;
  showOther: boolean = false;
  checkSexo: string = '';
  buscarOpcion: string = 'id';
  terminoBusqueda: string = '';
  empleados: any[] = [];//lista para almacenar los empleados filtrados

  //listas que almacenan el contenido de las tablas
  empleadoList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  dptoList$!: Observable<any[]>;

  
  constructor(private service: CommunicationApiService) { }

  ngOnInit() {
    this.empleadoList$ = this.service.getEmpleadosList();

    this.empleadoList$.subscribe((data) => {
      this.empleados = data;
    });

    

    this.areaList$ = this.service.getAreaList();

    //devuelve el contenido de la tabla de departamentos ordenada alfabeticamente
    this.dptoList$ = this.service.getDepartamentos().pipe(
      map(departamentos => departamentos.sort((a, b) => a.depDescp.localeCompare(b.depDescp)))
    );
  }

  buscar() {
    const term = this.terminoBusqueda.trim().toLowerCase();
  
    if (term === '') {
      // Si el término de búsqueda está vacío, mostrar todos los empleados
      this.empleadoList$.subscribe((data) => {
        this.empleados = data;
      });
    } else {
      // Filtrar la lista de empleados por el criterio de búsqueda seleccionado
      this.empleadoList$.subscribe((data) => {
        this.empleados = data.filter((empleado) => {
          switch (this.buscarOpcion) {
            case 'id':
              return empleado.empleadoIdentificacion.toLowerCase().includes(term);
            case 'name':
              return empleado.empleadoNombres.toLowerCase().includes(term);
            case 'lastname':
              return empleado.empleadoApellidos.toLowerCase().includes(term);
            default:
              return false;
          }
        });
      });
    }
  }
  

  //incrementa el valor d la variable que controla la pagina actual que se muestra
  nextPage():void {
    this.currentPage++;
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage():void {
    if (this.currentPage > 1) {
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  editar(view: string): void {
    this.changeview = view;
    this.edicion = true;
  }

  changeView(view: string): void {
    this.clear();
    this.changeview = view;
    this.edicion = false;
  }

  checkOtro(){
    if( this.checkSexo === 'M'){
      this.showOther = false;
      this.empSexo = this.checkSexo;
      console.log(this.empSexo);
    }else if(this.checkSexo === 'F'){
      this.showOther = false;
      this.empSexo = this.checkSexo;
      console.log(this.empSexo);
    }else if (this.checkSexo === 'otro'){
      this.empSexo = '';
      this.checkSexo = 'otro'
      this.showOther = true;
    }
  }

  //limpia todas las variables locales que guardan los datos del empleado
  clear():void{
    this.empNombres = '';
    this.empApellidos = '';
    this.empCorreo = '';
    this.empIdentificacion = '';
    this.empArea = 0;
    this.empDpto = 0;
    this.empId = 0;
    this.empIdNomina = 0;
    this.empSexo = '';
    this.empTelefono = '';
    this.empTipoId = '';
    this.empEstado = '';
  }

  //limpia la variable que guarda el temrino a buscar y ejecuta ngOnInit
  clearSearch():void{
    this.terminoBusqueda = '';
    this.ngOnInit();
  }

  //limpia las variables y regresa a la vista de consultar
  cancelar(): void {
    this.clear();
    this.changeview = 'consulta';
  }

  agregarEmpleado(){
    const data = {
      empleadoCompania: 1,
      empleadoIdNomina: this.empIdNomina,
      empleadoIdDpto: this.empDpto,
      empleadoIdArea: this.empArea,
      empleadoTipoId: this.empTipoId,
      empleadoIdentificacion: this.empIdentificacion,
      empleadoNombres: this.empNombres,
      empleadoApellidos: this.empApellidos,
      empleadoSexo: this.empSexo,
      empleadoTelefono: this.empTelefono,
      empleadoCorreo: this.empCorreo,
      empleadoEstado: this.empEstado
    };

    this.service.addEmpleados(data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Empleado agregado exitosamente:', response);
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al agregar el empleado:', error);
      }
    );

    this.mensajeExito = 'Empleado registrado exitosamente.';
    setTimeout(() => {
      this.mensajeExito = '';
      this.changeview = 'consulta';
      }, 1000);
  }

  editarEmpleado(id: number) {
    this.empId = id;

    this.service.getEmpleadoById(this.empId).subscribe(
      response => {
        //aunque no se muestren en pantalla todas, guardamos todos los datos que trae nuestra tabla en variables locales para luego usarlas al enviar el put
        this.empIdNomina = response.empleadoIdNomina;
        this.empNombres = response.empleadoNombres;
        this.empApellidos = response.empleadoApellidos;
        this.empIdentificacion = response.empleadoIdentificacion;
        this.empCorreo = response.empleadoCorreo;
        this.empArea = response.empleadoIdArea;
        this.empDpto = response.empleadoIdDpto;
        this.empTipoId = response.empleadoTipoId;
        this.empSexo = response.empleadoSexo;
        this.empTelefono = response.empleadoTelefono;
        this.empEstado = response.empleadoEstado;
        console.log(this.empDpto);
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
      empleadoIdNomina: this.empIdNomina,
      empleadoIdDpto: this.empDpto,
      empleadoIdArea: this.empArea,
      empleadoCompania: 1,
      empleadoTipoId: this.empTipoId,
      empleadoIdentificacion: this.empIdentificacion,
      empleadoNombres: this.empNombres,
      empleadoApellidos: this.empApellidos,
      empleadoSexo: this.empSexo,
      empleadoTelefono: this.empTelefono,
      empleadoCorreo: this.empCorreo,
      empleadoEstado: this.empEstado
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
      this.clear();

      this.changeview = 'consulta';
    }, 1000);
  }

}

