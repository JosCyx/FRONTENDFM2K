import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { MovimientosControllerService } from 'src/app/services/comunicationAPI/inventario/movimientos-controller.service';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';
import { ProductoControllerService } from 'src/app/services/comunicationAPI/inventario/producto-controller.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as XLSX from 'xlsx-js-style';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-visualizar-inventario',
  templateUrl: './visualizar-inventario.component.html',
  styleUrls: ['./visualizar-inventario.component.css'],
})
export class VisualizarInventarioComponent {
  @ViewChild(MatPaginator) "paginator": MatPaginator;
  @ViewChild('fileInput') fileInput: any;

  displayedColumns: string[] = ['codigo', 'producto', 'unidad', 'cantidad', 'last_price', 'categoria', 'observ'];
  dataSource = new MatTableDataSource<any>();

  //areaSelected: number = 1;
  //sectorSelected: number = 1;

  originalData: any[] = [];

  //lista de sectores
  sectoresList: any[] = [];

  //lista de areas
  areasList: any[] = [];

  //listado de unidades
  unidadesList: any[] = [];

  //listado de categorías
  categoriasList: any[] = [];

  //listado de productos asignados al sector
  sectorProducts: any[] = [];

  showAsignButton: boolean = false;

  private confirmSubscription: Subscription;

  constructor(
    private router: Router,
    private dialogService: DialogServiceService,
    private generalService: GeneralControllerService,
    private movService: MovimientosControllerService,
    public globalInvService: GlobalInventarioService,
    private productoService: ProductoControllerService,
    private cookieService: CookieService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.confirmSubscription = this.globalInvService.confirmObserv.subscribe((data) => {
      if (data) {
        this.consultarProductos();
      }
    });
  }

  ngOnInit(): void {

    const areaUsuario = Number(this.cookieService.get('userArea'));

    //this.globalInvService.areaSelected = areaUsuario;
    //console.log("area selected", this.globalInvService.areaSelected);
    //console.log("sector selected", this.globalInvService.sectorSelected);


    //filtrar areas segun el area del usuario

    setTimeout(() => {
      //CONSULTA EL GRUPO AUTORIZADO DEL USUARIO
      this.generalService.getAuthGrupo(this.cookieService.get('userIdNomina'), Number(this.cookieService.get('userArea'))).subscribe(
        (data: any) => {
          this.globalInvService.grupoAutorizado = data;
          //console.log('grupo autorizado', data,  this.globalInvService.grupoAutorizado);
        },
        (error) => {
          console.log('error al consultar el grupo autorizado', error);
        }
      );


    }, 100);

    setTimeout(() => {
      //consultar las areas
      this.generalService.getGeneralData(6, 0).subscribe(
        (data) => {
          this.areasList = data;

          /*if (!(this.globalInvService.grupoAutorizado >= 12 && this.globalInvService.grupoAutorizado <= 13)) {
            //filtrar las areas segun el area del usuario
            this.areasList = this.areasList.filter(area => area.codigo == areaUsuario);
            console.log("areas filtradas")
          }*/

          if (!(this.globalInvService.grupoAutorizado.some(grupo => grupo >= 12 && grupo <= 13))) {
            //filtrar las areas segun el area del usuario
            this.areasList = this.areasList.filter(area => area.codigo == areaUsuario);
            //console.log("areas filtradas")
          }

          //console.log("areas", data);
        },
        (error) => {
          console.error(error);
        }
      );

      this.generalService.getGeneralData(5, 0).subscribe(
        (data) => {
          this.unidadesList = data;
          //console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );

      this.showAsignButton = false;

      this.sectorProducts = [];
      this.dataSource.data = [];

      if (this.globalInvService.areaSelected != 0) {
        this.consultarGrupos();
      }
      if (this.globalInvService.sectorSelected != 0) {
        this.consultarProductos();
      }


      this.globalInvService.dataSourceCopyHistory = [];
    }, 200);
  }

  ngOnDestroy() {
    if (this.confirmSubscription) {
      this.globalInvService.setConfirmObserv(false);
      this.confirmSubscription.unsubscribe();
    }

    this.sectorProducts = [];
    this.dataSource.data = [];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  consultarProductos() {

    this.showAsignButton = true;
    //console.log("consultar productos");
    this.sectorProducts = [];
    this.dataSource.data = [];
    this.productoService.getProdSector(this.globalInvService.sectorSelected).subscribe(
      (data) => {
        this.globalInvService.sectorName = this.returnSectorNameById(this.globalInvService.sectorSelected);
        //console.log("sector name", this.globalInvService.sectorName);
        this.sectorProducts = _.cloneDeep(data);
        this.originalData = _.cloneDeep(data);
        this.dataSource.data = this.sectorProducts;
        //console.log("productos: ", data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  consultarGrupos() {
    //console.log("consultar grupos");
    this.sectoresList = [];
    this.generalService.getGeneralData(4, this.globalInvService.areaSelected).subscribe(
      (data) => {
        this.sectoresList = data;
        //console.log(data);

        if (this.sectoresList.length > 0) {
          //consultar los productos asignados al sector
          //this.consultarProductos()

        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.generalService.getGeneralData(1, this.globalInvService.areaSelected).subscribe(
      (data) => {
        this.categoriasList = data;
        //console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  callAsignProduct() {
    const sectorSelected = this.globalInvService.sectorSelected;
    const grupoAutorizado = this.globalInvService.grupoAutorizado;

    //PRODUCCION 12, DESARROLLO 13
    if (grupoAutorizado.some(grupo => grupo === 12) || grupoAutorizado.some(grupo => grupo === sectorSelected)) {
      if (sectorSelected !== 0) {
        this.dialogService.openAsignarProductoDialog();
      } else {
        this.callMensaje("Debe seleccionar un área y un sector antes de asignar un producto", false);
      }
    } else {
      this.callMensaje("No tiene permisos para asignar productos a este sector", false);
    }

    //PRODUCCION 12, DESARROLLO 13
    /*if (grupoAutorizado === 12 || sectorSelected === grupoAutorizado) {
      if (sectorSelected !== 0) {
        this.dialogService.openAsignarProductoDialog();
      } else {
        this.callMensaje("Debe seleccionar un área y un sector antes de asignar un producto", false);
      }
    } else {
      this.callMensaje("No tiene permisos para asignar productos a este sector", false);
    }*/
  }


  //seleccionar un producto de la lista para registrar movimientos
  selectProduct(producto: any) {
    //datos de producto seleccionado
    //this.globalInvService.productoToView = producto;
    this.sectorProducts = [];
    this.dataSource.data = [];

    this.globalInvService.productSelectedID = producto.id;
    //guardar el producto en el globalinventarioservice y redirigir al otro ocmponente
    this.router.navigate(['detalleProducto']);
  }

  ///////////////////////////////////////FILTROS/////////////////////////////////////
  filterType: number = 0;
  //almacena el valor del filtro cuando se selecciona una cadena
  filterStrContent: string = "";
  //almacena el valor del filtro cuando se selecciona una opcion de las listas
  filterTypeContent: number = 0;

  //establece el tipo de filtro seleccionado
  setFilterType(type: number): void {
    this.filterType = type;
  }

  //limpia los filtros
  clearFilter(): void {
    this.filterType = 0;
    this.filterStrContent = "";
    this.dataSource.data = _.cloneDeep(this.originalData);
  }

  //extrae el valor del filtro de la cadena
  applyStrFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filterStrContent = inputElement.value;
      this.applyFilter();
    }
  }

  //extrae el valor del filtro de las listas
  applyListFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.filterTypeContent = Number(selectElement.value);
      this.applyFilter();
    }
  }

  //aplica el filtro seleccionado
  applyFilter(): void {
    if (this.filterType === 1) {
      this.dataSource.data = this.originalData.filter(item =>
        item.codigo.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 2) {
      this.dataSource.data = this.originalData.filter(item =>
        item.producto.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 3) {
      this.dataSource.data = this.originalData.filter(item =>
        item.unidad == this.getUnidadNameById(this.filterTypeContent)
      );
    } else if (this.filterType === 4) {
      this.dataSource.data = this.originalData.filter(item =>
        item.cantidad.toString().toLowerCase().includes(this.filterStrContent)
      );
    } else if (this.filterType === 5) {
      this.dataSource.data = this.originalData.filter(item =>
        item.categoria == this.getCategoryNameById(this.filterTypeContent)
      );
    }
  }

  //obtiene el nombre de la categoria por el id
  getCategoryNameById(categoryId: number): string {
    const category = this.categoriasList.find(cat => cat.codigo === categoryId);
    return category ? category.nombre : '';
  }

  //obtiene el nombre de la unidad por el id
  getUnidadNameById(unidadId: number): string {
    const unidad = this.unidadesList.find(u => u.codigo === unidadId);
    return unidad ? unidad.nombre : '';
  }

  sortByCodigo(type: number) {
    //si es 1 ordena de forma ascendente
    if (type == 1) {
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.codigo > b.codigo) ? 1 : -1);
    } else {
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.codigo < b.codigo) ? 1 : -1);
    }
  }

  sortByNombre(type: number) {
    //si es 1 ordena de forma ascendente
    if (type == 1) {
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.producto > b.producto) ? 1 : -1);
    } else {
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.producto < b.producto) ? 1 : -1);
    }
  }

  /////////////////////////////////////exportar a excel
  exportToExcel() {
    // Crear un nuevo libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Convertir los datos del dataSource a una hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map(row => {
      const rowData: { [key: string]: any } = {};
      this.displayedColumns.forEach(column => rowData[column.toUpperCase()] = row[column as keyof typeof row]);
      return rowData;
    }));

    // Obtener el rango de celdas ARREGLAR
    const ref: any = ws['!ref'];
    const range = XLSX.utils.decode_range(ref);

    // Aplicar estilos a las celdas
    for (let row = range.s.r; row <= range.e.r; ++row) {
      const rowAddress = XLSX.utils.encode_row(row);
      for (let col = range.s.c; col <= range.e.c; ++col) { // Cambié range.s.r a range.s.c
        const colAddress = XLSX.utils.encode_col(col);
        const cellAddress = colAddress + rowAddress;

        // Definir el estilo de los bordes
        const borderStyle = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        };

        // Establecer el color de fondo y el texto en negrita para la primera fila
        if (row === range.s.r) {
          ws[cellAddress].s = {
            fill: { fgColor: { rgb: '4f81bd' } },
            font: { bold: true },
            border: borderStyle
          };
        } else {
          // Establecer otro color de fondo para las filas restantes
          ws[cellAddress].s = {
            fill: { fgColor: { rgb: 'dce6f1' } },
            border: borderStyle
          };
        }
      }
    }

    // Agregar la hoja de cálculo al libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, 'productos');

    // Formatear la fecha
    const formattedDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-'); // Reemplaza '/' con '-' para evitar problemas con el nombre del archivo

    // Construir el nombre del archivo
    const fileName = 'Productos ' + this.returnSectorNameById(this.globalInvService.sectorSelected) + ' ' + formattedDate + '.xlsx';

    // Descargar el archivo de Excel
    XLSX.writeFile(wb, fileName);;
  }

  returnSectorNameById(sectorId: number): string {
    const sector = this.sectoresList.find(s => s.codigo === sectorId);
    return sector ? sector.nombre : '';
  }

  exportPDF() {

  }

}