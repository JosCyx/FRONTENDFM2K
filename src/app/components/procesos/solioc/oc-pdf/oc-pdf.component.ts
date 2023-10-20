import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { map } from 'rxjs';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { GlobalService } from 'src/app/services/global.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface CabOC {
  cabecera: any;
  detalles: any;
  items: any;
}
@Component({
  selector: 'app-oc-pdf',
  templateUrl: './oc-pdf.component.html',
  styleUrls: ['./oc-pdf.component.css'],
})
export class OcPdfComponent implements OnInit {
  //id de orden Compra
  solID: number = this.serviceGlobal.solID;
  //Variables
  datosCabOC!: CabOC;
  empleados: string = '';
  areas: string = '';
  inpectores: string = '';
  nivelRuta: string = '';
  //Variables de Array
  empleadoedit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];

  constructor(
    private serviceGlobal: GlobalService,
    private cabOCService: CabOrdCompraService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private provService: ProveedorService,
    private nivRuteService: NivelRuteoService
  ) {}

  ngOnInit(): void {
    this.empService.getEmpleadosList().subscribe((data) => {
      this.empleadoedit = data;
    });
    this.areaService.getAreaList().subscribe((data) => {
      this.area = data;
    });
    this.nivRuteService
      .getNivelbyEstado('A')
      .pipe(map((niv) => niv.sort((a, b) => a.nivel - b.nivel)))
      .subscribe((data) => {
        this.NivelRuta = data;
      });
  }

  ClickPDF() {
    try {
      this.cabOCService.getOrdenComprabyId(this.solID).subscribe({
        next: (resp: any) => {
          this.datosCabOC = resp;
          console.log('este es mi daros ', this.datosCabOC);
          this.traerEmpleado();
          this.TraerArea();
          this.EstadoTracking();
          const pdfc: any = {
            content: [
              { text: 'Imagen', margin: [0, 20] },
              { text: 'FUNDACION MALECON 2000', style: 'header' },
              {
                text: 'ORDEN DE COMPRA',
                alignment: 'center',
                style: 'subheader',
                margin: [0, 10, 0, 30],
              },
              {
                text: this.datosCabOC.cabecera.cabSolOCNumerico,
                algnment: 'right',
                margin: [0, 0, 10, 5],
              },
              {
                fontSize: 10,
                table: {
                  widths: [90, 160, 60, 70, 85],
                  body: [
                    [
                      { text: 'FECHA', style: 'tableHeader' },
                      {
                        text: this.formatDateToSpanish(
                          new Date(this.datosCabOC.cabecera.cabSolOCFecha)
                        ),
                      },
                      { text: 'AREA:' },
                      { text: this.areas, colSpan: 2 },
                      {},
                    ],
                    [
                      { text: 'SOLICITADO POR:', style: 'tableHeader' },
                      { text: this.empleados, colSpan: 4 },
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: 'PROVEEDOR', style: 'tableHeader' },
                      { text: this.datosCabOC.cabecera.cabSolOCProveedor },
                      { text: 'RUC', style: 'tableHeader' },
                      {
                        text: this.datosCabOC.cabecera.cabSolOCRUCProveedor,
                        colSpan: 2,
                      },
                      '',
                    ],
                    [
                      { text: 'APROBADO POR :', style: 'tableHeader' },
                      { text: '' },
                      { text: 'ESTADO:', style: 'tableHeader' },
                      { text: this.estadoTexto(), colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'FINANCIERO :', style: 'tableHeader' },
                      { text: '' },
                      { text: 'TRACKING', style: 'tableHeader' },
                      { text: this.nivelRuta, colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'ASUNTO', style: 'tableHeader' },
                      {
                        text: this.datosCabOC.cabecera.cabSolOCAsunto,
                        colSpan: 4,
                      },
                    ],
                  ],
                },
              },
              {
                margin: [0, 5, 0, 0],
                fontSize: 10,
                table: {
                  widths: [30, 200, 70, 50, 50, 56],
                  body: [
                    [
                      { text: 'ITEM', style: 'tableHeader' },
                      {
                        text: 'DESCRIPCION',
                        style: 'tableHeader',
                      },
                      { text: 'PRESUPUESTO', style: 'tableHeader', colSpan: 2 },
                      '',
                      { text: 'UNIDAD', style: 'tableHeader' },
                      {
                        text: 'CANTIDAD',
                        style: 'tableHeader',
                        alignment: 'center',
                      },
                    ],
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
          const pdf = pdfMake.createPdf(pdfc);
          pdf.open();
        },
      });
    } catch (error) {
      console.error('No se pudo crear pdf', error);
    }
  }

  formatDateToSpanish(date: Date): string {
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  }
  traerEmpleado() {
    for (let iterator of this.empleadoedit) {
      if (
        iterator.empleadoIdNomina ==
        this.datosCabOC.cabecera.cabSolOCSolicitante
      ) {
        this.empleados =
          iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
      }
    }
  }
  TraerArea() {
    for (let listArea of this.area) {
      if (listArea.areaIdNomina == this.datosCabOC.cabecera.cabSolOCArea) {
        this.areas = listArea.areaDecp;
      }
    }
  }
  estadoTexto(): string {
    switch (this.datosCabOC.cabecera.cabSolOCEstado) {
      case 'A':
        return 'Activo';
      case 'F':
        return 'Finalizado';
      case 'C':
        return 'Anulado';
      default:
        return ''; // Manejo por defecto si el valor no es A, F o C
    }
  }
  EstadoTracking() {
    for (const NvTrk of this.NivelRuta) {
      if (NvTrk.nivel === this.datosCabOC.cabecera.cabSolOCEstadoTracking) {
        this.nivelRuta = NvTrk.descRuteo;
      }
    }
  }
}
