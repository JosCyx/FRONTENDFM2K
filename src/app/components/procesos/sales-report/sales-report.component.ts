import { Component } from '@angular/core';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
import { GlobalService } from 'src/app/services/global.service';
import * as XLSX from 'xlsx-js-style';

interface DS {
  subactividad: string;
  cotizaciones: number;
  ordenesCompra: number;
}

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent {
  presupuestos: any[] = [];
  prespSelected: number = 0;

  startDate!: Date;
  endDate!: Date;

  enableExportButton: boolean = false;

  displayedColumns: string[] = ['subact', 'cot', 'oc', 'total'];

  dataSource: DS[] = [];

  loadingData: boolean = false;

  constructor(
    private dimService: DimensionesService,
    private dialogService: DialogServiceService
  ) { }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  getSubActName() {
    return this.presupuestos.find(
      (p) => p.dimDimprepId == this.prespSelected
    ).dimDimprepCodigo + ' - ' + this.presupuestos.find(
      (p) => p.dimDimprepId == this.prespSelected
    ).dimDimprepDescripcion;
  }

  get totalValor(): number {
    return this.dataSource.reduce((acc, item) => acc + item.cotizaciones + item.ordenesCompra, 0);
  }

  totalRow(cot: number, oc: number): number {
    return cot + oc;
  }

  ngOnInit() {
    setTimeout(() => {

      this.dimService.getDimPresupuesto().subscribe(
        (data) => {
          this.presupuestos = data;
        },
        (error) => {
          console.error(error);
        }
      );
    }, 200);
  }

  triggerGetReport() {
    if (this.startDate && this.endDate && this.prespSelected != 0) {
      
      this.enableExportButton = false;
      this.dataSource = [];
      
      if (this.startDate >= this.endDate) {
        this.callMensaje("La fecha de inicio no puede ser mayor a la fecha de fin.", false);
        return;
      }
      
      //mostrar spinner o card de busqueda
      this.loadingData = true;
      setTimeout(() => {
        this.getReport();
      }, 1500);
    }
  }

  getReport() {
    this.dimService.getProjectSalesReport(this.prespSelected, this.startDate.toISOString(), this.endDate.toISOString()).subscribe(
      (data) => {
        //console.log("Reporte obtenido:", data);

        //ocultar spinner o card de busqueda
        this.loadingData = false;

        if (data.length == 0) {
          //this.callMensaje("No se encontraron registros para el rango de fechas seleccionado.", false);
          return;
        }
        
        this.dataSource = data;
        this.enableExportButton = true;

      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }

  exportToExcel() {
    // Crear un nuevo libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Convertir los datos del dataSource1 a una hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.map(row => {
      return {
        'Subactividad': row.subactividad,
        'Cotizaciones': row.cotizaciones,
        'Ordenes de Compra': row.ordenesCompra,
        'Total Subactividad': this.totalRow(row.cotizaciones, row.ordenesCompra)
      };
    }));

    // Obtener el rango de celdas
    const ref: any = ws['!ref'];
    const range = XLSX.utils.decode_range(ref);

    // Aplicar estilos a las celdas
    for (let row = range.s.r; row <= range.e.r; ++row) {
      const rowAddress = XLSX.utils.encode_row(row);
      for (let col = range.s.c; col <= range.e.c; ++col) {
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

    // Calcular el total general de todas las filas
    const totalGeneral = this.dataSource.reduce((acc, row) => acc + this.totalRow(row.cotizaciones, row.ordenesCompra), 0);

    // Determinar la última fila y agregar el total en la siguiente fila
    const lastRow = range.e.r + 1;
    const totalLabelCell = `C${lastRow + 1}`;
    const totalValueCell = `D${lastRow + 1}`;

    // Agregar el total general en las celdas correspondientes
    ws[totalLabelCell] = { v: 'Total General:', s: { font: { bold: true }, alignment: { horizontal: 'right' } } };
    ws[totalValueCell] = { v: totalGeneral.toFixed(2), s: { font: { bold: true }, alignment: { horizontal: 'right' } } };

    // Actualizar el rango de la hoja de cálculo para incluir la fila adicional
    range.e.r = lastRow;
    ws['!ref'] = XLSX.utils.encode_range(range);

    // Agregar la hoja de cálculo al libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Egresos');

    // Formatear la fecha
    const startDate = new Date(this.startDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');

    const endDate = new Date(this.endDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');

    // Construir el nombre del archivo
    const fileName = 'Reporte de Egresos de ' + this.getSubActName() + ', desde ' + startDate + ' hasta ' + endDate + '.xlsx';

    // Descargar el archivo de Excel
    XLSX.writeFile(wb, fileName);
  }

}
