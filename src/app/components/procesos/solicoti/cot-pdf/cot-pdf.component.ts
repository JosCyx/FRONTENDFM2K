import { Component,Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { GlobalService } from 'src/app/services/global.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cot-pdf',
  templateUrl: './cot-pdf.component.html',
  styleUrls: ['./cot-pdf.component.css']
})
export class CotPdfComponent implements OnInit {
  //variables
  @Input() tipoSol:number=0;
  @Input() noSol:number=0;
  CabCotiza: string = 'SOLICITUD DE COTIZACIONES';
  //global 
  solID: number = this.serviceGlobal.solID;
  constructor(private service:CabCotizacionService,private serviceGlobal: GlobalService,
    ) { }
  ngOnInit(): void {
  }

imprimir(){
  console.log(this.solID);
}
  clickpdf(){
    const dd: any = {
      content: [
        {
          text: 'imagen',
          //  image: 'src\assets\img\icon.png',
          margin: [0, 20],
        },
        { text: 'FUNDACION MALECON 2000', style: 'header' },

        {
          text: this.CabCotiza,
          alignment: 'center',
          style: 'subheader',
          margin: [0, 10, 0, 30],
        },
        { text: 'No.IT 00220', alignment: 'right', margin: [0, 0, 10, 5] },
        {
          fontSize: 10,
          table: {
            widths: [85, 200, 100, 50, 30],
            body: [
              [
                { text: 'FECHA:' },
                { text: 'miercoles, 14 de junio  de 2023' },
                { text: 'SOLICITADO POR :' },
                { text: 'Ing.Kevin Recalde', colSpan: 2 },
                {},
              ],
              [
                { text: 'SECTOR:' },
                { text: 'Departamento de sistemas' },
                { text: 'ACTIVIDAD:' },
                { text: '', colSpan: 2 },
                '',
              ],
              [{ text: 'SUBACTIVIDADES:' },
              { text: '', colSpan: 4 },
              '',
              '',
              '',],
              [
                { text: 'ASUNTO' },
                {
                  text: 'Compra de Baterias para oficinas de programa educativo',
                  colSpan: 4,
                },
              ],
            ],
          },
        },
        {
          margin: [0, 5],
          fontSize: 10,
          table: {
            widths: [30, 200, 70, 50, 50, 56],
            body: [
              [
                { text: 'ITEM', style: 'tableHeader' },
                {
                  text: 'DESCRIPCION DEL TRABAJO:(ESPECIFICACIONES)',
                  style: 'tableHeader',
                },
                { text: 'PRESUPUESTO', style: 'tableHeader' },
                { text: 'UNIDAD', style: 'tableHeader' },
                {
                  text: 'CANTIDAD',
                  style: 'tableHeader',
                  colSpan: 2,
                  alignment: 'center',
                },
                '',
              ],
              [{}, {}, {}, {}, { text: '', colSpan: 2 }, ''],
              [
                {
                  text: 'MATERIALES Y PROCEDIMIENTO A SEGUIR:',
                  style: 'tableHeader',
                  colSpan: 6,
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                '',
              ],
              [
                { text: '1' },
                {
                  text: 'Compra de Baterias para UPS S de respaldo de energia en oficina de programacion educativo ',
                  colSpan: 5,
                },
                '',
                '',
                '',
                '',
              ],
              [{ text: '2' }, { text: '', colSpan: 5 }, '', '', '', ''],
              [{ text: '3' }, { text: '', colSpan: 5 }, '', '', '', ''],
              [
                { text: 'OBSERVACIONES', style: 'textos', colSpan: 6 },
                '',
                '',
                '',
                '',
                '',
              ],
              [{ text: '1' }, { text: '', colSpan: 5 }, '', '', '', ''],
              [{ text: '2' }, { text: '', colSpan: 5 }, '', '', '', ''],
              [
                { text: 'ADJUNTO COTIZACIONES:', style: 'textos', colSpan: 2 },
                '',
                { text: 'SI' },
                { text: 'NO:X' },
                { text: 'CUANTAS:' },
                '',
              ],
            ],
          },
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 10,
          table: {
            widths: [200, 100, 183],
            body: [
              [
                { text: 'PLAZO PARA ENTREGA DE OFERTAS' },
                { text: '', colSpan: 1 },
                {
                  text: '___DIA ___MES___ANO',
                  alignment: 'center',
                },
              ],
              [
                { text: 'FECHA MAXIMA ENTREGA DE TRABAJOS:' },
                { text: '', colSpan: 1 },
                {
                  text: '___DIA ___MES___ANO',
                  alignment: 'center',
                },
              ],
            ],
          },
        },
        {
          margin: [0, 5],
          fontSize: 10,
          table: {
            widths: [200, 100, 60, 115],
            body: [
              [
                { text: 'COORDINAR INSPECCION EN SITIO CON:', style: 'footer' },
                '',
                '',
                '',
              ],
              ['INSPECCION REALIZADA:', '', { text: 'TELEFONO:' }, ''],
            ],
          },
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
        },
        header: {
          fontSize: 20,
          alignment: 'center',
        },
        subheader: {
          fontSize: 15,
        },
        textos: {
          bold: true,
        },
        footer: {
          bold: true,
        },
      },
    };
    const pdf = pdfMake.createPdf(dd);
    pdf.open();

  }

}
