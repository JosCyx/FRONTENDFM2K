import { Component, ElementRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx-js-style';
import { AfterViewInit, ViewChild } from '@angular/core';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { Subscription } from 'rxjs';
import { ProductoControllerService } from 'src/app/services/comunicationAPI/inventario/producto-controller.service';
import { ExcelExportService } from 'src/app/services/comunicationAPI/inventario/excel-export.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleComponent {
  displayedColumns: string[] = ['CODIGO', 'PRODUCTO', 'UNIDAD', 'CANTIDAD', 'LAST_PRICE', 'CATEGORIA', 'OBSERVACIONES'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild('modalContainer') modalContainer!: ElementRef;
  @ViewChild('fileInput')
  fileInput: any;

  isimagen: boolean = false;
  tipoMovimiento: Number = 0

  private confirmSubscription: Subscription;

  constructor(
    private globalInvService: GlobalInventarioService,
    private dialogService: DialogServiceService,
    private productoService: ProductoControllerService,
    private excelExportService: ExcelExportService,
    private router: Router
  ) { 
    this.confirmSubscription = this.globalInvService.confirmObserv.subscribe((data) => {
      if (data) {
        //recargar el componente
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    //console.log(this.globalInvService.productoToView);

    //console.log(this.globalInvService.productSelectedID);

    this.productoService.getProductoData(this.globalInvService.sectorSelected ,this.globalInvService.productSelectedID).subscribe(
      (data) => {
        //console.log(data);
        //this.globalInvService.productoToView = data;
        this.dataSource.data = [
          { codigo: data[0].codigo, 
            producto: data[0].producto, 
            unidad: data[0].unidad, 
            cantidad: data[0].cantidad,
            last_price: data[0].last_price, 
            categoria: data[0].categoria, 
            observ: data[0].observ
          },
        ];
        this.globalInvService.productoToView.codigo = data[0].codigo;
        this.globalInvService.productoToView.producto = data[0].producto;
      },
      (error) => {
        console.error(error);
      }
    );

    /*this.dataSource.data = [
      { codigo: this.globalInvService.productoToView.codigo, 
        producto: this.globalInvService.productoToView.producto, 
        unidad: this.globalInvService.productoToView.unidad, 
        cantidad: this.globalInvService.productoToView.cantidad, 
        categoria: this.globalInvService.productoToView.categoria, 
        observ: this.globalInvService.productoToView.observ
      },
    ];*/
  }

  ngOnDestroy() {
    if (this.confirmSubscription) {
      this.globalInvService.setConfirmObserv(false);
      this.confirmSubscription.unsubscribe();
    }
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  registrarMov(){
    const sectorSelected = this.globalInvService.sectorSelected;
    const grupoAutorizado = this.globalInvService.grupoAutorizado;
  
    //PRODUCCION 12, DESARROLLO 13
    if (grupoAutorizado.some(grupo => grupo === 12) || grupoAutorizado.some(grupo => grupo === sectorSelected)) {
      this.globalInvService.productoNombre = this.globalInvService.productoToView.producto;
      this.dialogService.openMovimientoDialog();
    } else {
      this.callMensaje("No tiene permisos para asignar productos a este sector", false);
    }
  }

  deleteProduct(){
    console.log("PRODUCTO A ELIMINAR")
    console.log(this.globalInvService.sectorSelected );
    console.log(this.globalInvService.productSelectedID);

    this.productoService.deleteProduct(this.globalInvService.sectorSelected ,this.globalInvService.productSelectedID).subscribe(
      (data) => {
        console.log(data);
        if(data == 100){
          this.callMensaje("Producto eliminado correctamente", true);
          this.router.navigate(['/visualizarInventario']);
          //this.globalInvService.setConfirmObserv(true);
        } else if (data == 90){
          this.callMensaje("No se puede eliminar el producto, ya que tiene movimientos asociados", false);
        }
      },
      (error) => {
        console.error(error);
        this.callMensaje("Error al eliminar el producto", false);
      }
    );
  }

  //exportar a excel
  exportToExcel() {
    //console.log("nombre de sector:", this.globalInvService.sectorName);
    //console.log("sector:", this.globalInvService.sectorSelected);
    this.excelExportService.exportToExcel(this.dataSource.data, this.globalInvService.dataSourceCopyHistory, this.globalInvService.sectorName, this.globalInvService.productoToView.producto);
  }

  //exportar a pdf
  exportPDF(){

  }
}
