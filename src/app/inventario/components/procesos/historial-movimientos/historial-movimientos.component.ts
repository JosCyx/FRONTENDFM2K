import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ProductoControllerService } from 'src/app/services/comunicationAPI/inventario/producto-controller.service';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';
import * as XLSX from 'xlsx-js-style';
import * as _ from 'lodash';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.css']
})
export class HistorialMovimientosComponent {
  @ViewChild(MatPaginator) "paginator": MatPaginator;

  filterValue: number = 4;

  displayedColumns: string[] = [
    'fecha', 
    'ingreso', 
    'egreso', 
    'devolucion', 
    'existencia', 
    'pr_unit', 
    'pr_total', 
    'proveedor', 
    'destino', 
    'observaciones',
    'kardex'
  ];

  dataSource = new MatTableDataSource<any>();
  dataFilterMovCopy: any[] = [];
  dataSourceCopy: any[] = [];

  private confirmSubscription: Subscription;

  constructor(
    private globalInvService: GlobalInventarioService,
    private productoService: ProductoControllerService
  ) { 
    this.confirmSubscription = this.globalInvService.confirmObserv.subscribe((data) => {
      if (data) {
        //recargar el componente
        this.ngOnInit()
      }
    });
  }

  ngOnInit(): void {
    this.productoService.getProdMov(this.globalInvService.productSelectedID, this.globalInvService.sectorSelected).subscribe(
      (data) => {
        console.log("Movimientos:",data);
        this.dataSource.data = data;
        this.globalInvService.dataSourceCopyHistory = data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        if(error.status == 404){
          console.log("No se encontraron movimientos");
        } else {
          console.error(error);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.confirmSubscription) {
      this.globalInvService.setConfirmObserv(false);
      this.confirmSubscription.unsubscribe();
    }
  }

  showLineNumber(valor: number){
    return valor == 0 ? '-' : valor;
  }

  showLinePrice(valor: number): string {
    if (valor === 0) {
      return '-';
    }

    return valor.toFixed(2);
  }
  
  showLineString(valor: string){
    return valor == '' || valor == ' ' ? '-' : valor;
  }

  //modificar columnas de la tabla
  handleColumns() {
    let newDisplayedColumns = _.cloneDeep(this.displayedColumns); // Hacemos una copia profunda de la matriz original
    if(this.dataSourceCopy.length == 0){
      //se realiza un copia de la tabla original para no perder los datos en caso de que la copia esté vacía
      this.dataSourceCopy = _.cloneDeep(this.dataSource.data); 
    } else {
      //si ya existe la copia se restauran los datos originales para aplicar de nuevo el filtro
      this.dataSource.data = _.cloneDeep(this.dataSourceCopy); 
    }
      
    switch (this.filterValue) {
      case 1:
        this.globalInvService.filterHistoryName = '-Ingresos-';
        newDisplayedColumns = ['fecha', 'ingreso', 'pr_unit', 'pr_total', 'proveedor', 'destino', 'observaciones', 'kardex'];
  
        // Filtrar las filas que tengan 0 en la columna egreso y devolución
        this.dataSource.data = this.dataSource.data.filter(element => element.egreso == 0 && element.devolucion == 0);

        break;
      case 2:
        this.globalInvService.filterHistoryName = '-Egresos-';
        newDisplayedColumns = ['fecha', 'egreso', 'pr_unit', 'pr_total', 'proveedor', 'destino', 'observaciones', 'kardex'];

        // Filtrar las filas que tengan 0 en la columna ingreso y devolución
        this.dataSource.data = this.dataSource.data.filter(element => element.ingreso == 0 && element.devolucion == 0);
        break;
      case 3:
        this.globalInvService.filterHistoryName = '-Devoluciones-';
        newDisplayedColumns = ['fecha', 'devolucion', 'pr_unit', 'pr_total', 'proveedor', 'destino', 'observaciones', 'kardex'];
  
        // Filtrar las filas que tengan 0 en la columna ingreso y egreso
        this.dataSource.data = this.dataSource.data.filter(element => element.ingreso == 0 && element.egreso == 0);
        break;
      default:
        this.globalInvService.filterHistoryName = '-Todos-';
        newDisplayedColumns = ['fecha', 'ingreso', 'egreso', 'devolucion', 'pr_unit', 'pr_total', 'proveedor', 'destino', 'observaciones', 'kardex'];
  
        // Volver los datos a la normalidad
        this.dataSource.data = this.dataSourceCopy;
        //console.log("datos originales", this.dataSource.data, this.dataSourceCopy);
        break;
    }
      
    this.displayedColumns = newDisplayedColumns;
    this.handleCopyTable();
  }
  

  //crear una copia de la tabla con las columnas eliminadas
  handleCopyTable() {
    this.dataFilterMovCopy = _.cloneDeep(this.dataSource.data); // Hacemos una copia profunda de la matriz original
    
    switch (this.filterValue) {
      case 1:
        this.dataFilterMovCopy.forEach((element: any) => {
          delete element.egreso;
          delete element.devolucion;
          delete element.existencia;
        });
        break;
      case 2:
        this.dataFilterMovCopy.forEach((element: any) => {
          delete element.ingreso;
          delete element.devolucion;
          delete element.existencia;
        });
        break;
      case 3:
        this.dataFilterMovCopy.forEach((element: any) => {
          delete element.ingreso;
          delete element.egreso;
          delete element.existencia;
        });
        break;
      default:
        break;
    }

    this.globalInvService.dataSourceCopyHistory = this.dataFilterMovCopy;
  }
}
