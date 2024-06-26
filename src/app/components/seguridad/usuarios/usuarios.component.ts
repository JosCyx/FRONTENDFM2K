import { Component } from '@angular/core';
import { set } from 'date-fns';
import { Observable, connect } from 'rxjs';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { UsuariosService } from 'src/app/services/comunicationAPI/seguridad/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {
  //mensaje de alerta
  msjExito: string = '';
  msjError: string = '';
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  //
  nombreBusqueda: string = '';
  showMsjPassConfirm: boolean = false;
  mensajeText: string = 'Las contraseñas no coinciden';

  newUserId: string = '';
  newUser: string = '';
  newPass: string = '';
  newNombre: string = '';
  newNomina: number = 0;
  newEstado: string = 'A';
  newFechaInicio: Date = new Date();
  newFechaFin: Date = new Date();

  confirmPass: string = '';
  changeview: string = 'consulta';
  currentPage: number = 1;

  userList$!: Observable<any[]>;
  listUsers: any[] = [];

  busqTipo: number = 1;
  busqTerm: string = '';

  boolenanPass: boolean = false;

  constructor(
    private usuarioService: UsuariosService,
    private empleadoService: EmpleadosService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      
      //llama los datos de los usuarios desde la api
      this.userList$ = this.usuarioService.getUsuariosList();
  
      //guarda los usuarios en una lista local para un manejo mas sencillo
      this.userList$.subscribe((data) => {
        this.listUsers = data;
      });
    }, 100);
  }

  agregarUsuario() {
    const usuario: any = {
      usEmpresa: 1,
      usLogin: this.newUser.trim(),
      usContrasenia: this.newPass.trim(),
      usNombre: this.newNombre,
      usIdNomina: this.newNomina,
      usEstado: this.newEstado,
      usActivo: 1,
      usFechaInicio: this.formatDateToYYYYMMDD(this.newFechaInicio),
      usFechaCaduca: this.formatDateToYYYYMMDD(
        this.CalcularFechaFin(this.newFechaInicio)
      ),
    };

    console.log('usuario: ', usuario);
    this.usuarioService.addNewUsuario(usuario).subscribe({
      next: (response) => {
        console.log('Usuario creado con exito', response);

        this.showmsj = true;
        this.msjExito = 'Usuario creado con exito';
        setTimeout(() => {
          this.clear();
          this.changeView('consulta');
          this.ngOnInit();
        }, 3000);
      },
      error: (error) => {
        console.log('Error: ', error);
        if (error.status == 409){
          this.showmsjerror = true;
          this.msjError = 'Error, el usuario ya existe.';
        } else {
          this.showmsjerror = true;
          this.msjError = 'Error al crear el usuario';
        }
        setTimeout(() => {
          this.showmsjerror = false;
          this.msjError = '';
        }, 3000);
      },
      complete: () => {
        console.log('Proceso completado');
      },
    });
  }
  //formeatea la fecha para que sea compatible con el formato de la base de datos
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  clear(): void {
    this.nombreBusqueda = '';
    this.newUser = '';
    this.newPass = '';
    this.newNombre = '';
    this.newNomina = 0;
    this.newEstado = 'A';
    this.newFechaInicio = new Date();
    this.newFechaFin = new Date();
    this.showmsj = false;
    this.showmsjerror = false;
    this.msjExito = '';
    this.msjError = '';
    this.confirmPass = '';
  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.changeview = view;
    this.clear();
  }

  Cancelar(): void {
    this.clear();
    this.changeView('consulta');
    this.mensajeText = '';
    this.showMsjPassConfirm = false;
  }

  //incrementa el valor d la variable que controla la pagina actual que se muestra
  nextPage(): void {
    console.log('nextPage', this.currentPage);
    if (this.listUsers.length <= 10) {
      this.currentPage = 1;
    } else if (this.currentPage >= this.listUsers.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++;
    }
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
      this.userList$.subscribe((data) => {
        this.listUsers = data;
      });
      return;
    } else {
      this.usuarioService.searchUsuarios(tipo, term).subscribe(
        (response) => {
          this.listUsers = [];
          this.listUsers = response;
          console.log('Respuesta exitosa', response);
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    }
  }

  cancelSearch() {
    this.busqTerm = '';
    this.searchUsuario(1, '');
  }

  //busqueda de empleado para registrar usuario
  private inputTimer: any;
  empleados: any[] = [];
  empleadosList$!: Observable<any[]>;
  userTmp: string = '';

  searchEmpleados(): void {
    if (this.nombreBusqueda.length > 2) {
      this.empleadoService.getEmpleadosList().subscribe(
        (Response) => {
          this.empleados = Response;
        },
        (error) => {
          console.log('Error: ', error);
        }
      );

      console.log('empleados: ', this.empleados);
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
        const empleadoSeleccionado = this.empleados.find(
          (emp) =>
            emp.empleadoNombres + ' ' + emp.empleadoApellidos ===
            this.nombreBusqueda
        );

        this.newNombre = empleadoSeleccionado
          ? empleadoSeleccionado.empleadoNombres +
            ' ' +
            empleadoSeleccionado.empleadoApellidos
          : 'No se ha encontrado al empleado';
        this.newNomina = empleadoSeleccionado
          ? empleadoSeleccionado.empleadoIdNomina
          : 0;
        this.userTmp = empleadoSeleccionado
          ? empleadoSeleccionado.empleadoIdentificacion
          : 'No se ha encontrado al empleado';
        this.DigitosNov();

        console.log('resultado:', this.newNombre, this.newNomina, this.newUser);
      } else {
        this.newNombre = '';
        this.newNomina = 0;
        this.newUser = '';
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  //Metodo
  CalcularFechaFin(fecha: Date) {
    var calculofecha: Date = new Date();
    calculofecha.setMonth(fecha.getMonth() + 3);

    return calculofecha;
  }
  //Metodo para agregar un 0 al inicio del numero de identificacion si este es de 9 digitos y comienza por 9
  DigitosNov() {
    if (this.userTmp.length == 9 && this.userTmp.charAt(0) == '9') {
      this.newUser = '0' + this.userTmp;
    } else {
      this.newUser = this.userTmp;
    }
  }
  //cCONFIRMA LA CONSTRASEÑA
  confirmPassword() {
    if (this.newPass != this.confirmPass) {
      this.showMsjPassConfirm = true;
      this.boolenanPass = false;
      this.mensajeText='Las contraseñas no coinciden';
    } else if (this.confirmPass == this.newPass || this.confirmPass == '') {
      this.boolenanPass = true;
      this.showMsjPassConfirm = false;
    }
  }
  //Metodo para editar un usuario
  changeEditar(usuario: any) {
    this.changeView('editar');
    this.newUserId = usuario.usId;
    this.newUser = usuario.usLogin;
    this.newNombre = usuario.usNombre;
    this.newNomina = usuario.usIdNomina;
    this.newEstado = usuario.usEstado;
    console.log('Esimpri9mo es tp ', usuario);
  }

  editUsuario() {
    if (this.newPass != '' && this.boolenanPass == true) {
      const usActivo = this.newEstado == 'A' ? 1 : 0;
      const editData: any = {
        usId: this.newUserId,
        usEmpresa: 1,
        usLogin: this.newUser.trim(),
        usContrasenia: this.newPass.trim(),
        usNombre: this.newNombre,
        usIdNomina: this.newNomina,
        usEstado: this.newEstado,
        usActivo: usActivo,
        usFechaInicio: this.formatDateToYYYYMMDD(new Date()),
        usFechaCaduca: this.formatDateToYYYYMMDD(
          this.CalcularFechaFin(new Date())
        ),
      };
      this.usuarioService.editUsuario(this.newNomina,editData).subscribe(
        (response) => {
          this.showmsj = true;
          this.msjExito = 'Usuario editado con exito';
          setTimeout(() => {
            this.clear();
            this.changeView('consulta');
            this.ngOnInit();
          }, 3000);
        },
        (error) => {
          console.log('Error: ', error);
          this.showmsjerror = true;
          this.msjError = 'Error al editar el usuario';
          setTimeout(() => {
            this.showmsjerror = false;
            this.msjError = '';
          }, 3000);
        }
      );
      console.log('usuario: ', editData);
    } else {
      if (this.newPass == '') {
        this.showmsjerror = true;
        this.msjError = 'La contraseña no puede estar vacia';
      }
    }
    console.log('usuario: ', this.newFechaInicio, ' /', this.newFechaFin);
  }
}
