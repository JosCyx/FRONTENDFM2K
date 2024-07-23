import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { DialogServiceService } from '../../dialog-service.service';
import { GlobalInventarioService } from '../../global-inventario.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(
    private dialogService: DialogServiceService,
    private globalInvService: GlobalInventarioService
  ) { }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }


  exportToExcel(dataSource1: any[], dataSource2: any[], sectorName: string, producto: string) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    if(dataSource1.length == 0){
      this.callMensaje('No se ha seleccionado ningun producto, imposible exportar.', false);
      return;
    }
  
    const startCellTable1 = { r: 2, c: 2 }; // C3
    XLSX.utils.sheet_add_json(ws, dataSource1, {
      header: Object.keys(dataSource1[0]),
      origin: XLSX.utils.encode_cell(startCellTable1)
    });
  
    if(dataSource2.length == 0){
      this.callMensaje('No hay movimientos disponibles para exportar.', false);
      return;
    }

    const startCellTable2 = { r: startCellTable1.r + dataSource1.length + 3, c: 2 };
    XLSX.utils.sheet_add_json(ws, dataSource2, {
      header: Object.keys(dataSource2[0]), 
      origin: XLSX.utils.encode_cell(startCellTable2)
    });
  
    const range1 = XLSX.utils.decode_range(XLSX.utils.encode_range({
      s: startCellTable1,
      e: { r: startCellTable1.r + dataSource1.length, c: startCellTable1.c + Object.keys(dataSource1[0]).length - 1 }
    }));
  
    const range2 = XLSX.utils.decode_range(XLSX.utils.encode_range({
      s: startCellTable2,
      e: { r: startCellTable2.r + dataSource2.length, c: startCellTable2.c + Object.keys(dataSource2[0]).length - 1 }
    }));
  
    const applyStyles = (ws: XLSX.WorkSheet, range: { s: { r: number, c: number }, e: { r: number, c: number } }) => {
      for (let row = range.s.r; row <= range.e.r; ++row) {
        const rowAddress = XLSX.utils.encode_row(row);
        for (let col = range.s.c; col <= range.e.c; ++col) {
          const colAddress = XLSX.utils.encode_col(col);
          const cellAddress = colAddress + rowAddress;
  
          const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          };
  
          if (row === range.s.r) {
            ws[cellAddress].s = {
              fill: { fgColor: { rgb: '4f81bd' } },
              font: { bold: true },
              border: borderStyle
            };
          } else {
            ws[cellAddress].s = {
              fill: { fgColor: { rgb: 'dce6f1' } },
              border: borderStyle
            };
          }
        }
      }
    };
  
    applyStyles(ws, range1);
    applyStyles(ws, range2);
  
    XLSX.utils.book_append_sheet(wb, ws, 'productos');
  
    const formattedDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  
    const fileName = producto + '-' + sectorName + this.globalInvService.filterHistoryName + formattedDate + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }
  
}
