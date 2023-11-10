import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { RolesService } from 'src/app/services/comunicationAPI/seguridad/roles.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  //variables para guardar los datos del rol nuevo
  roCodigo: number = 0;//almacena el id del rol que se seleccione
  nombre: string = '';
  NivelRuteo: number = 0;
  estado: string = '';

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  mensajeExito: string = '';
  msjError: string='';
  showmsj: boolean = false;
  showmsjerror: boolean = false;

  currentPage: number = 1;


  //listas
  rolList:any[]=[];
  appsList$!: Observable<any[]>;
  NivelesRuteo:any[] = [];

  // Map to display data associate with foreign keys
  //rolsMap: Map<number, string> = new Map()

  constructor(private rolService: RolesService,
     private nivelservice:NivelRuteoService) { }

  ngOnInit() {
    setTimeout(() => {
      
      this.rolService.getRolsList().subscribe({
        next: rols => {
          this.rolList= rols;
        },
        error:(err)=> {
            console.log ("error",err)
        }
      });
      this.nivelservice.getNivelruteo().subscribe({
        next: niveles => {
          this.NivelesRuteo = niveles;
        },error:(err)=> {
          console.log ("error",err)
      }
      });
    }, 100);
  }

  agregarRol(): void {
    // Crear el objeto JSON con los datos del rol
    const data = {
      roEmpresa: 1, // define el valor por defecto de la empresa 
      roNombre: this.nombre.trim(),
      roEstado: this.estado,
      roNivelRt: this.NivelRuteo
    };
    //Llamar al método addRols() del servicio para enviar los datos a la API
    this.rolService.addRols(data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        this.showmsj=true;
        this.mensajeExito = 'Rol registrado exitosamente.';
        setTimeout(() => {
          this.showmsj=false;
          this.mensajeExito = '';
          this.showmsjerror=false;
          this.msjError='';
          this.changeview = 'consulta';
          this.ngOnInit();
          }, 3000);

      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al agregar el rol:', error);
        this.showmsjerror=true;
        this.msjError="Error al agregar el rol";
      }
    );

    //muestra mensaje de exito y redirige a la otra vista luego de 1 segundo
    
  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
    this.nombre = '';
    this.NivelRuteo = 0;
    this.estado = '';

    this.changeview = view;

  }
  //resetea las variables a valores vacios y cambia la variable de vista para mostrar la lista de roles 
  cancelar(): void {
    this.nombre = '';
    this.NivelRuteo = 0;
    this.estado = '';
    this.changeview = 'consulta';
  }

  //recibe el id del rol y lo guarda en una variable local y trae los datos de dicho rol desde la API para cargarlos en las variables locales
  editarRol(rol: any): void {
        // Asignar los valores del rol obtenido a las variables locales
        this.roCodigo=rol.roCodigo;
        this.nombre = rol.roNombre;
        this.NivelRuteo = rol.roNivelRt;
        this.estado = rol.roEstado;   
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
      roNivelRt: this.NivelRuteo // Ajusta el valor según tus requisitos
    };
    console.log("ediciopnsdsd",data)
    // Llamar al método updateRols() del servicio para enviar los datos actualizados a la API
    this.rolService.updateRols(this.roCodigo, data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Rol actualizado exitosamente:', response);
        this.showmsj=true;
        this.mensajeExito="Edicion exitosa";

      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al actualizar el rol:', error);
        this.showmsjerror=true;
        this.msjError="Error al editar";
      }
    );
    setTimeout(() => {
      // Restablecer las variables locales a sus valores iniciales
      this.nombre = '';
      this.NivelRuteo = 0;
      this.estado = '';
      this.mensajeExito = '';
      this.showmsj=false;
      this.showmsjerror=false;
      this.msjError='';
      this.changeview = 'consulta';
      this.ngOnInit();
      }, 3000);
  }
  
  /*elimina un rol de la tabla roles de la base de datos, no se usa por el momento ya que la eliminacion de los elementos debe ser lógica
  es decir se deben inactivar y no eliminar*/
  eliminarRol(roCodigo : number):void{
    this.rolService.deleteRols(roCodigo).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        console.log('Rol eliminadp exitosamente:', response);
      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al eliminar el rol:', error);
      }
    );
  }
  //
  nextPage(): void {
    console.log("nextPage",this.currentPage);
    if(  this.rolList.length <=10 ){
      this.currentPage=1;
    }else if(this.currentPage >= this.rolList.length/10){
      this.currentPage=this.currentPage;
    }else{
      this.currentPage++
    }
  }
  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      console.log("prevPage",this.currentPage);
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }
  clear(){

  }
}
