import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { GlobalService } from 'src/app/services/global.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';



@Component({
  selector: 'app-allrequest',
  templateUrl: './allrequest.component.html',
  styleUrls: ['./allrequest.component.css']
})

export class AllrequestComponent implements OnInit {
  @ViewChild(MatPaginator) "paginator": MatPaginator;
  @ViewChild('filterInput') filterInput!: ElementRef;  // Referencia al input

  //lista de tipo de solicitudes
  tipoSol$!: Observable<any[]>;
  bsqTipoSol: number = 1;

  changeview: string = 'consultar';

  currentPage!: number;

  displayedColumns: string[] = ['column1', 'column2', 'column3', 'column4', 'column5', 'column7', 'column8', 'column9', 'column6'];
  dataSource = new MatTableDataSource<any>();
  dataSourceOriginal = new MatTableDataSource<any>();

  constructor(private router: Router,
    private serviceGlobal: GlobalService,
    private tipoSolService: TipoSolService,
    private cabCotService: CabCotizacionService,
    private cookieService: CookieService,) { }

  ngOnInit(): void {
    this.serviceGlobal.loadingSolicitud = false;
    this.serviceGlobal.solValor = 0;
    this.serviceGlobal.solOC = '';
    setTimeout(() => {
      this.tipoSol$ = this.tipoSolService.getTipoSolicitud();
    }, 200);
    
    setTimeout(() => {
      this.bsqTipoSol = this.serviceGlobal.tipoSolBsq;
      this.consultarSol();
    }, 300);
    this.bsqTipoSol = 1; 
  }

  ngOnDestroy(){
    this.serviceGlobal.currentPage = this.currentPage;
  }

  consultarSol(): void {
    //extraer el tipo de solicitud que se va a consultar
    const tipoSol = this.bsqTipoSol;
    
    //extraer el nivel maximo del usuario logueado
    let listaRoles = this.cookieService.get('userRolNiveles').split(',').map(Number);
    const maxNivel = Math.max(...listaRoles);

    //extraer el id de la nomina del usuario
    const idNomina = this.cookieService.get('userIdNomina');

    //extraer el area del usuario logueado
    const idArea = Number(this.cookieService.get('userArea'));

    //consultar las solicitudes
    this.cabCotService.getAllSolicitudes(tipoSol, maxNivel, idNomina, idArea).subscribe(
      (response: any[]) => {
        //console.log("Resultado:", response);
        this.dataSource.data = _.cloneDeep(response);
        this.dataSourceOriginal.data = _.cloneDeep(response);
        this.dataSource.paginator = this.paginator;

        this.paginator.pageIndex = this.serviceGlobal.currentPage; // Cambiar página programáticamente
        this.paginator._changePageSize(this.paginator.pageSize); // Refrescar el paginador
      },
      (error) => {
        console.log("Error al consultar las solicitudes:", error);
      }
    );

  }

  async selectSol(id: number) {
    this.serviceGlobal.currentPage = this.currentPage;
    this.serviceGlobal.solView = 'editar';
    this.serviceGlobal.solID = id;
    this.serviceGlobal.changePage = true;

    if (this.bsqTipoSol == 1) {
      this.router.navigate(['solicoti']);
    } else if (this.bsqTipoSol == 2) {
      this.router.navigate(['solioc']);
    } else if (this.bsqTipoSol == 3) {
      this.router.navigate(['solipago']);
    }
  }

  //FILTROS
  //almacena el tipo de filtro seleccionado
  filterType: number = 0;
  //almacena el valor del filtro cuando se selecciona una cadena
  filterStrContent: string = "";
  //almacena el valor del filtro cuando se selecciona una opcion de las listas
  //filterTypeContent: number = 0;

  //variable para controlar el cambio de filtro
  handleFilter: boolean = false;

  //establece el tipo de filtro seleccionado, si se selecciona el mismo tipo de filtro se limpia el filtro
  setFilterType(type: number): void {
    this.filterType = type;
    if (this.handleFilter) {
      this.handleFilter = false
      this.filterType = 0;
      this.filterStrContent = "";
      this.dataSource.data = _.cloneDeep(this.dataSourceOriginal.data);
    } else {
      this.handleFilter = true;
      setTimeout(() => {
        this.filterInput.nativeElement.focus();        // Establece el foco en el input
      }, 0); 
    }
  }

  //aplica el filtro de cadena
  applyStrFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filterStrContent = inputElement.value;
      this.applyFilter();
    }
  }

  //aplica el filtro de lista
  /*applyListFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.filterTypeContent = Number(selectElement.value);
      this.applyFilter();
    }
  }*/


  //aplica el filtro dependiendo del tipo seleccionado
  applyFilter(): void {
    if (this.filterType === 1) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column1.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    }else if (this.filterType === 2) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column2.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 3) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column3.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 4) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column4.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 5) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column5.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 6) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column6.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 7) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column7.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 8) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column8.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 9) {
      this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
        item.column9.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    }

  }

  getRowColor(estadoTRK: number): string {
    //console.log("Estado:", estadoTRK);
    if(estadoTRK == 0){
      return 'rojo';
    } else if(estadoTRK == 50){
      return 'verde';
    } else if (estadoTRK == 9999){
      return 'rojo';
    } else if(estadoTRK < 50){
      return 'azul';
    } else if(estadoTRK > 50){
      return 'naranja';
    }
    return 'rojo';
  }

  returnEmptyData(value: string): string{
    return value == '' ? 'Aún no registrada' : value;
  }

  handlePage(event: any) {
    this.currentPage = event.pageIndex; // Guardar la página actual
    console.log('Página actual:', this.currentPage);
  }
}
