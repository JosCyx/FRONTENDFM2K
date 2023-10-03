import { Component, OnInit } from '@angular/core';
import { AplicacionesService } from 'src/app/services/comunicationAPI/seguridad/aplicaciones.service';

@Component({
  selector: 'app-aplicaciones',
  templateUrl: './aplicaciones.component.html',
  styleUrls: ['./aplicaciones.component.css'],
})
export class AplicacionesComponent implements OnInit {
  changeview: string = 'consulta';
  //Variables para guardar los datos de la aplicacion nueva
  roCodigo: number = 0;
  nombre: string = '';
  nemonico: string ='';
  estado: string = '';
  version:string='';

  currentPage: number = 1;
  //mensaje de exito o error
  showmsj: boolean = false;
  mensajeExito: string = '';
  showmsjerror: boolean = false;
  msjError: string = '';


  //ARRAY  DE LISTA DE APLICACIONES
  aplicacionesList: any[] = [];

  constructor(private appService: AplicacionesService) {}

  ngOnInit(): void {
    this.appService.getAplicacionesList().subscribe({
      next: (apps) => {
        this.aplicacionesList = apps;
        console.log(apps);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('proceso completado');
      },
    });
  }

  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
     this.nombre = '';
    this.nemonico = '';
     this.estado = '';
     this.changeview = view;
  }
  cancelar(): void {
    this.nombre = '';
    this.nemonico = '';
    this.estado = '';
    this.version = '';
    this.changeview = 'consulta';
  }
  //Paginacion de navegacion
  nextPage(): void {
    console.log('nextPage', this.currentPage);
    if (this.aplicacionesList.length  <= 5) {
      this.currentPage = 1;
    } else if (this.currentPage >= this.aplicacionesList.length / 5) {
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
  //Add 
  agregarAplic(): void {
    const data={
      apEmpresa: 1,
      apEstado: this.estado,
      apFuncion:1,
      apNemonico: this.nemonico.trim(),
      apNombre: this.nombre.trim(),
      apVersion: this.version.trim(),

    }
    this.appService.addAplicaciones(data).subscribe({
      next: (response) => {
        console.log('Aplicacion agregada exitosamente:', response);
        this.showmsj = true;
        this.mensajeExito = 'Aplicacion agregada exitosamente';

    },
    error: (err) => {console.error(err);
      this.showmsjerror=true;
      this.msjError="Error al agregar Apliacion";
    },
    complete: () => {
      console.log('proceso completado');
    },
    });
    //  tiempo de  de espera 
    setTimeout(() => {
      this.showmsj=false;
      this.mensajeExito = '';
      this.showmsjerror=false;
      this.msjError='';
      this.changeview = 'consulta';
      this.ngOnInit();
      }, 1000);
  }
  //Al momento de presionar el boton me  diriga a la vista de edicion y vacia los campo
  editarRol(rol: any): void {
    this.roCodigo = rol.apCodigo;
    this.nombre = rol.apNombre;
    this.nemonico = rol.apNemonico;
    this.estado = rol.apEstado;
    this.version = rol.apVersion;
    //Variable para controlar la vista de edicion
    this.changeview = 'editar';
  }
  guardarEdicion(): void {
    const data={
  apEmpresa: 1,
  apCodigo: this.roCodigo,
  apNombre: this.nombre,
  apNemonico: this.nemonico,
  apFuncion: 1,
  apEstado: this.estado,
  apVersion: this.version
    }
    console.log("dattos editadps",data);
    this.appService.updateAplicaciones(this.roCodigo,data).subscribe({
      next: (response) => {
        console.log('Aplicacion editada exitosamente:', response);
        this.showmsj = true;
        this.mensajeExito = 'Aplicacion editada exitosamente';
    },
    error: (err) => {
      console.error(err)
      this.showmsjerror=true;
      this.msjError="Error al editar Apliacion";
    },
    complete: () => {console.log('proceso completado');}
    }); 
    setTimeout(() => {
      this.nombre = '';
      this.nemonico = '';
      this.estado = '';
      this.version = '';
      this.showmsj=false;
      this.mensajeExito = '';
      this.showmsjerror=false;
      this.msjError='';
      this.changeview = 'consulta';
      this.ngOnInit();
      }, 1000);
  }
}
