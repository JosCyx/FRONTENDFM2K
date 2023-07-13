import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-ruteo',
  templateUrl: './ruteo.component.html',
  styleUrls: ['./ruteo.component.css']
})
export class RuteoComponent {
  areas = ['Operaciones', 'Sistemas', 'Marketing', 'Contabilidad'];
  departamento:string='';
  tiposoli:string='';
  nombre: string = '';
  aplicacion: string = '';
  idsoli: number = 0;
  estado: string = '';
  codigo: string = '';
  indice: number = 0;
  mensajeExito: string = '';
  activeStatus: boolean = false;
  
  niveles = [
    { area: 'Operaciones', niveles: [false, false, false, false, false, false, false] },
    { area: 'Sistemas', niveles: [false, false, false, false, false, false, false] },
    { area: 'Marketing', niveles: [false, false, false, false, false, false,false] },
    { area: 'Contabilidad', niveles: [false, false, false, false, false, false, false] }
  ];
  TipoSolicitudesList$!:Observable<any[]>;
  SolicotiList$!:Observable<any[]>;
  DepartamentoList$!:Observable<any[]>;
  

   // Map to display data associate with foreign keys
   nivelesMap:Map<number, string> = new Map()


  selectedRow: number = -1;
  currentPage: number = 0;
  itemsPerPage: number = 1;
  edicion: boolean = false;

  changeview: string = 'consultar';  
  constructor(private servicios:CommunicationApiService) {

  }
  ngOnInit(){
    this.TipoSolicitudesList$ = this.servicios.obtenerTipoSolicitud();
    this.SolicotiList$ = this.servicios.getRutList();
    this.DepartamentoList$ = this.servicios.obtenerDepartamento();
  }
  


  getNivelesByArea(area: string): boolean[] {
    const nivelObj = this.niveles.find(nivel => nivel.area === area);
    return nivelObj ? nivelObj.niveles : [];
  }

  isNivelChecked(area: string, index: number): boolean {
    const niveles = this.getNivelesByArea(area);
    return niveles[index - 1];
  }

  toggleNivel(area: string, index: number): void {
    const niveles = this.getNivelesByArea(area);
    niveles[index - 1] = !niveles[index - 1];
  }

  toggleDropdown(index: number): void {
    this.selectedRow = (this.selectedRow === index) ? -1 : index;
  }

  changeView(view: string): void {
    this.changeview = view;
  }
  guardarNiveles(): void {
this.changeview = "consultar";
  }

  // editarRut(index: number): void {
  //   //guarda el valor de la posicion del elemento a editar
  //   this.indice = index;

  //   // Asignar los valores del objeto rol a las propiedades existentes
  //   this.codigo = rut.codigo;
  //   this.nombre = rut.nombre;
  //   this.aplicacion = rut.aplicacion;
  //   this.estado = rut.estado;

  //   const data = {
  //     rutNombre: this.nombre,
  //     rutEstado: this.estado,
  //     rutAplicacion: this.idArea // Ajusta el valor según tus requisitos
  //   };

  //   //cambia la variable de vista para mostrar la pantalla de edicion
  //   this.changeview = 'editar';
  // }
  
}

