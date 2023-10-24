import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { map } from 'rxjs';
import { format, parseISO } from 'date-fns';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';
import { GlobalService } from 'src/app/services/global.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface SP {
  cabecera: any;
  detalles: any;
}
@Component({
  selector: 'app-sp-pdf',
  templateUrl: './sp-pdf.component.html',
  styleUrls: ['./sp-pdf.component.css'],
})
export class SpPdfComponent implements OnInit {
  solID: number = this.serviceGlobal.solID;
  //Variables
  datosSP!: SP;
  empleados: string = '';
  areas: string = '';
  nivelRuta: string = '';

  //ARRAY
  empleadoedit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];
  combinarObJ: any = [];

  constructor(
    private serviceGlobal: GlobalService,
    private cabPagoService: CabPagoService,
    private empService: EmpleadosService,
    private areaService: AreasService,
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

  clickPdf() {
    try {
      this.cabPagoService.getSolPagobyId(this.solID).subscribe({
        next: (response) => {
          this.datosSP = response;
          this.traerEmpleado();
          this.TraerArea();
          this.EstadoTracking();
          this.retornarTabla();
          console.log('esta es mi respuesta', this.datosSP);

          const PDFSP: any = {
            content: [
              { text: 'FUNDACION MALECON 2000', style: 'header' },
              {
                text: 'SOLICITUD DE PAGO',
                alignment: 'center',
                style: 'subheader',
                margin: [0, 10, 0, 30],
              },
              {
                text: this.datosSP.cabecera.cabPagoNumerico,
                algnment: 'right',
                margin: [0, 0, 10, 5],
              },
              {
                fontSize: 10,
                table: {
                  widths: [90, 170, 70, 95, 40],
                  body: [
                    [
                      { text: 'FECHA', style: 'tableHeader' },
                      {
                        text: this.formatDateToSpanish(
                          new Date(this.datosSP.cabecera.cabPagoFechaEmision)
                        ),
                      },
                      { text: 'NO DE ORDEN COMPRA', style: 'tableHeader' },
                      {
                        text: this.datosSP.cabecera.cabPagoNoOrdenCompra,
                        colSpan: 2,
                      },
                      '',
                    ],
                    [
                      { text: 'SOLICITADO POR ', style: 'tableHeader' },
                      { text: this.empleados },
                      { text: 'AREA', style: 'tableHeader' },
                      { text: this.areas, colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'FECHA DE FACTURA', style: 'tableHeader' },
                      {
                        text: this.formatDateToSpanish(
                          new Date(this.datosSP.cabecera.cabPagoFechaFactura)
                        ),
                      },
                      { text: 'NO DE FACTURA ', style: 'tableHeader' },
                      {
                        text: this.datosSP.cabecera.cabPagoNumFactura,
                        colSpan: 2,
                      },
                      '',
                    ],
                    [
                      { text: 'PROVEEDOR', style: 'tableHeader' },
                      { text: this.datosSP.cabecera.cabPagoProveedor },
                      { text: 'RUC', style: 'tableHeader' },
                      {
                        text: this.datosSP.cabecera.cabPagoRucProveedor,
                        colSpan: 2,
                      },
                      '',
                    ],
                    [
                      { text: 'ESTADO', style: 'tableHeader' },
                      { text: this.estadoTexto() },
                      { text: 'TRACKING', style: 'tableHeader' },
                      { text: this.nivelRuta, colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'APROBADO POR ', style: 'tableHeader' },
                      { text: '', colSpan: 4 },
                      '',
                      '',
                      '',
                    ],
                  ],
                },
              },
              {
                margin: [0, 5, 0, 0],
                fontSize: 10,
                table: {
                  widths: [30, 170, 70, 70, 60, 56],
                  body: [
                    [
                      { text: 'N°', style: 'tableHeader' },
                      { text: 'ITEM', style: 'tableHeader' },
                      { text: 'CANTIDAD CONTRATADA', style: 'tableHeader' },
                      { text: 'CANTIDAD RECIBIDA', style: 'tableHeader' },
                      { text: 'VALOR UNITARO', style: 'tableHeader' },
                      { text: 'SUBTOTAL', style: 'tableHeader' },
                    ],
                    ...this.combinarObJ,
                    [
                      '',
                      '',
                      '',
                      '',
                      { text: 'TOTAL' },
                      { text: this.datosSP.cabecera.cabpagototal },
                    ],
                    [
                      {
                        text: 'OBSERVACIONES',
                        style: 'tableHeader',
                        colSpan: 6,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: '1' },
                      {
                        text: this.datosSP.cabecera.cabPagoObservaciones,
                        colSpan: 5,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      {
                        text: 'APLICAR MULTA',
                        style: 'tableHeader',
                        colSpan: 6,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: '1' },
                      {
                        text: this.datosSP.cabecera.cabPagoAplicarMulta,
                        colSpan: 5,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      {
                        text: 'VALOR A DESCONTAR ',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      { text: this.datosSP.cabecera.cabPagoValorMulta },
                      {
                        text: 'PAGO TOTAL AUTORIZADO',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      { text: this.datosSP.cabecera.cabPagoValorTotalAut },
                    ],
                    [
                      { text: 'RECIBE ', style: 'tableHeader', colSpan: 2 },
                      '',
                      { text: this.datosSP.cabecera.cabPagoValorMulta },
                      {
                        text: 'FECHA DE INSPECCION',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      {
                        text: (this.datosSP.cabecera.cabPagoFechaInspeccion =
                          format(
                            parseISO(
                              this.datosSP.cabecera.cabPagoFechaInspeccion
                            ),
                            'yyyy-MM-dd'
                          )),
                      },
                    ],
                    [
                      {
                        text: 'CANCELA ORDEN',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      { text: this.datosSP.cabecera.cabPagoCancelacionOrden },
                      '',
                      '',
                      {
                        text: (this.datosSP.cabecera.cabPagoFechaInspeccion =
                          format(
                            parseISO(
                              this.datosSP.cabecera.cabPagoFechaInspeccion
                            ),
                            'yyyy-MM-dd'
                          )),
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
          const pdf = pdfMake.createPdf(PDFSP);
          pdf.open();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } catch (error) {
      console.error(error);
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
        iterator.empleadoIdNomina == this.datosSP.cabecera.cabSolOCSolicitante
      ) {
        this.empleados =
          iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
      }
    }
  }
  TraerArea() {
    for (let listArea of this.area) {
      if (
        listArea.areaIdNomina == this.datosSP.cabecera.cabPagoAreaSolicitante
      ) {
        this.areas = listArea.areaDecp;
      }
    }
  }
  estadoTexto(): string {
    switch (this.datosSP.cabecera.cabPagoEstado) {
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
      if (NvTrk.nivel === this.datosSP.cabecera.cabPagoEstadoTrack) {
        this.nivelRuta = NvTrk.descRuteo;
      }
    }
  }
  retornarTabla() {
    const item = this.datosSP.detalles.sort(
      (a: any, b: any) => a.detPagoIdDetalle - b.detPagoIdDetalle
    );
    console.log('dame esto ', item);
    let datosDetalles = item.map((item: any) => {
      return {
        detPagoIdDetalle: item.detPagoIdDetalle,
        detPagoItemDesc: item.detPagoItemDesc,
        detPagoCantContratada: item.detPagoCantContratada,
        detPagoCantRecibida: item.detPagoCantRecibida,
        detPagoValUnitario: item.detPagoValUnitario,
        detPagoSubtotal: item.detPagoSubtotal,
      };
    });
    for (let index = 0; index < datosDetalles.length; index++) {
      const {
        detPagoIdDetalle,
        detPagoItemDesc,
        detPagoCantContratada,
        detPagoCantRecibida,
        detPagoValUnitario,
        detPagoSubtotal,
      } = datosDetalles[index];
      const datos = [
        { text: detPagoIdDetalle },
        { text: detPagoItemDesc },
        { text: detPagoCantContratada },
        { text: detPagoCantRecibida },
        { text: detPagoValUnitario },
        { text: detPagoSubtotal },
      ];
      this.combinarObJ.push(datos);
    }
  }
  //this.datosSP.cabecera.cabPagoCancelacionOrden
  // CancelarOrden(orden: string):string{
  //   switch (orden) {
  //     case 'T':
  //       return 'TOTAL';
  //     case 'T':
  //       return 'PARCIAL';
  // }
}