import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { UsuariosService } from 'src/app/services/comunicationAPI/seguridad/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  nombreBusqueda: string = '';
  showMsjPassConfirm: boolean = false;
  mensajeText: string = 'Las contraseñas no coinciden';

  newUser: string = '';
  newPass: string = '';
  newNombre: string = '';
  newNomina: number = 0;
  newEstado: string = 'A';
  echaInicio: Date = new Date;
  newFechaInicio: Date = new Date;
  newFechaFin: Date = new Date;

  confirmPass: string = '';
  changeview: string = 'consulta';
  currentPage: number = 1;


  userList$!: Observable<any[]>;
  listUsers: any[] = [];

  busqTipo: number = 1;
  busqTerm: string = '';

  constructor(private usuarioService: UsuariosService,
              private empleadoService: EmpleadosService) { }

  ngOnInit(): void {
    //llama los datos de los usuarios desde la api
    this.userList$ = this.usuarioService.getUsuariosList();

    //guarda los usuarios en una lista local para un manejo mas sencillo
    this.userList$.subscribe(
      (data) => {
        this.listUsers = data;
      }
    );

  }

  agregarUsuario() {
    const usuario: any = {
      usLogin: this.newUser,
      usContrasenia: this.newPass,
      usNombre: this.newNombre,
      usIdNomina: this.newNomina,
      usEstado: this.newEstado,
      usFechaInicio: this.newFechaInicio,
      usFechaFin: this.newFechaFin
    }


    this.usuarioService.addNewUsuario(usuario).subscribe(
      response => {
        console.log("Usuario creado con exito",response);
      },
      error => {
        console.log("Error: ",error);
      }
    );

    //resetea las variables para que no muestren contenido en la vista
    this.newUser = '';
    this.newPass = '';
    this.newNombre = '';
    this.newNomina = 0;
    this.newEstado = '';
    this.newFechaInicio = new Date;
    this.newFechaFin = new Date;

    //regresa a la vista consulta donde se muestran todos los roles
    this.changeview = 'consulta';
  }

  clear(): void {
    this.newUser = '';
    this.newPass = '';
    this.newNombre = '';
    this.newNomina = 0;
    this.newEstado = '';
    this.newFechaInicio = new Date;
    this.newFechaFin = new Date;

  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.clear();

    this.changeview = view;
  }

  //incrementa el valor d la variable que controla la pagina actual que se muestra
  nextPage(): void {
    this.currentPage++;
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  //dispara la busqueda de usuarios
  triggerSearch() {
    this.searchUsuario(this.busqTipo, this.busqTerm);
  }

  //busca los usuarios por el tipo de busqueda y el termino de busqueda
  searchUsuario(tipo: number, term: string) {
    if (term == '') {
      this.userList$ = this.usuarioService.getUsuariosList();
      this.userList$.subscribe(
        (data) => {
          this.listUsers = data;
        }
      );
      return;
    } else {
      this.usuarioService.searchUsuarios(tipo, term).subscribe(
        response => {
          this.listUsers = [];
          this.listUsers = response;
          console.log("Respuesta exitosa", response);
        },
        error => {
          console.log("Error: ", error);
        }
      );

    }

  }

  cancelSearch(){
    this.busqTerm = '';
    this.searchUsuario(1, '');
  }

  //busqueda de empleado para registrar usuario
  private inputTimer: any;
  empleados: any[] = [];
  empleadosList$!: Observable<any[]>;


  searchEmpleados(): void {
    if (this.nombreBusqueda.length > 2) {
      
      this.empleadoService.getEmpleadosList();

      this.empleadosList$.subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }

  }


  onInputChanged(): void {
    // Cancelamos el temporizador anterior antes de crear uno nuevo
    clearTimeout(this.inputTimer);

    // Creamos un nuevo temporizador que ejecutará el método después de 1 segundo
    this.inputTimer = setTimeout(() => {
      // Coloca aquí la lógica que deseas ejecutar después de que el usuario haya terminado de modificar el input
      if (this.nombreBusqueda) {
        const empleadoSeleccionado = this.empleados.find(emp => (emp.empleadoNombres + ' ' + emp.empleadoApellidos) === this.nombreBusqueda);
        
        this.newNombre = empleadoSeleccionado ? empleadoSeleccionado.empleadoNombres + empleadoSeleccionado.empleadoApellidos : 'No se ha encontrado al empleado';
        this.newNomina = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdNomina : 0;
        this.newUser = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdentificacion : 'No se ha encontrado al empleado';

        console.log("resultado:", this.newNombre, this.newNomina, this.newUser );
      } else {
        this.newNombre = '';
        this.newNomina = 0;
        this.newUser = '';
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  confirmPassword(){
    if(this.newPass != this.confirmPass){
      this.showMsjPassConfirm = true;
    }else{
      this.showMsjPassConfirm = false;
    }
  }

  editUsuario(usuario: any){
    const editUsuario: any = {  
      usId: usuario.usId,
      usLogin: usuario.usLogin,
      usContrasenia: usuario.usContrasenia,
      usNombre: usuario.usNombre,
      usIdNomina: usuario.usIdNomina,
      usEstado: usuario.usEstado,
      usFechaInicio: usuario.usFechaInicio,
      usFechaFin: usuario.usFechaFin
    }

    this.usuarioService.editUsuario(usuario.idNomina, editUsuario).subscribe(
      response => {
        console.log("Usuario editado con exito",response);
      },
      error => {
        console.log("Error: ",error);
      }
    );
  }
}

