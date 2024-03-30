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
import { SolTimeService } from 'src/app/services/comunicationAPI/solicitudes/sol-time.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface SP {
  cabecera: any;
  detalles: any;
  facturas: any;
  detalleFacturas: any;
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
  recibe: string = '';
  areas: string = '';
  nivelRuta: string = '';

  //ARRAY
  empleadoedit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];
  combinarObJ: any = [];

  Imagen: string = 'assets/img/icon.png';
  copiaImgen: string = '';

  showFactInfo: boolean = false;
  facturasInfo: any = [];

  constructor(
    private serviceGlobal: GlobalService,
    private cabPagoService: CabPagoService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private solTimeService: SolTimeService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {

      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadoedit = data;
      });

      this.areaService.getAreaList().subscribe((data) => {
        this.area = data;
      });
    }, 100);
    this.nivRuteService
      .getNivelruteo()
      .pipe(map((niv) => niv.sort((a, b) => a.nivel - b.nivel)))
      .subscribe((data) => {
        this.NivelRuta = data;
      });
  }

  clickPdf() {
    try {
      this.traerdatos();
      this.cabPagoService.getSolPagobyId(this.solID).subscribe({
        next: async (response) => {
          this.datosSP = response;

          if(this.datosSP.cabecera.cabPagoEstadoTrack >= 50){
            this.datosSP.cabecera.cabPagoFechaEmision = await this.getFechaCompras();
          }

          console.log("mostrar info factura: ", this.showFactInfo)
          console.log("solicitud:", this.datosSP);
          this.traerEmpleado();
          this.traerRecibe();
          this.TraerArea();
          this.EstadoTracking();
          if (this.datosSP.cabecera.cabPagoType == 'legacy') {
            console.log("Solicitud antigua")
            //carga los detalles de la solicitud de pago y muestra la info de la factura especifica
            this.retornarTabla();
            this.setFacturasInfo();
          } else if (this.datosSP.cabecera.cabPagoType == 'new') {
            console.log("Solicitud nueva")
            //formatea las facturas si la solicitud es nueva
            this.formatearFacturasPdf();
            this.formatearDetalleFacturasPdf();
          }
          this.Aprobado();
          //console.log('esta es mi respuesta', this.datosSP);

          const PDFSP: any = {
            content: [
              {
                image: this.copiaImgen,
                width: 50,
                height: 50,
                margin: [0, 20],
              },
              { text: 'FUNDACION MALECON 2000', style: 'header' },
              {
                text: 'SOLICITUD DE PAGO',
                alignment: 'center',
                style: 'subheader',
                margin: [0, 10, 0, 30],
              },
              {
                text: this.datosSP.cabecera.cabPagoNumerico,
                alignment: 'right',
                margin: [0, 0, 10, 5],
              },
              {
                fontSize: 10,
                table: {
                  widths: [90, 170, 130, 50, 25],
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
                    ...this.facturasInfo,
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
                      { text: this.datosSP.cabecera.cabPagoApprovedBy },
                      { text: 'SOLICITUD ASOCIADA ', style: 'tableHeader' },
                      { text: this.datosSP.cabecera.cabPagoNoSolOC, colSpan: 2 },
                      ''
                    ],
                  ],
                },
              },
              {
                margin: [0, 5, 0, 0],
                fontSize: 10,
                table: {
                  widths: this.widths,
                  body: [
                    ...this.combinarObJ,
                    [
                      '',
                      '',
                      '',
                      '',
                      { text: 'TOTAL' },
                      { text: this.datosSP.cabecera.cabPagoValorTotalAut },
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
                      { text: this.recibe },
                      {
                        text: 'FECHA DE INSPECCION',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      {
                        text: (this.datosSP.cabecera.cabPagoFechaInspeccion === null ? 'Sin fecha' : format(
                          parseISO(this.datosSP.cabecera.cabPagoFechaInspeccion), 'yyyy-MM-dd')),
                      },
                    ],
                    [
                      {
                        text: 'CANCELACION DE ORDEN',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      {
                        text: this.CancelarOrden(
                          this.datosSP.cabecera.cabPagoCancelacionOrden
                        ),
                        colSpan: 4,
                      },
                      '',
                      '',
                      '',
                    ],
                    [
                      {
                        text: 'COMENTARIOS DE CANCELACION',
                        style: 'tableHeader',
                        colSpan: 2,
                      },
                      '',
                      {
                        text: this.datosSP.cabecera.cabPagoObservCancelacion,
                        colSpan: 4,
                      },
                      '',
                      '',
                      '',
                    ],
                  ],
                },
              },
              ////////////////DETALLES DE FACTURAS/////////////////////
              this.cabeceraDetallesFact,
              {
                fontSize: 10,
                table: {
                  body: [
                    this.cabeceraDetalles
                    ,
                    ...this.detallesFact
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
          pdf.download(this.datosSP.cabecera.cabPagoNumerico);
          this.clear();
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
  traerRecibe() {
    for (let iterator of this.empleadoedit) {
      if (iterator.empleadoIdNomina == this.datosSP.cabecera.cabPagoReceptor) {
        this.recibe =
          iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
      }
    }
  }
  traerEmpleado() {
    for (let iterator of this.empleadoedit) {
      if (
        iterator.empleadoIdNomina == this.datosSP.cabecera.cabPagoSolicitante
      ) {
        this.empleados =
          iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
      }
    }
  }
  TraerArea() {
    for (let listArea of this.area) {
      if (
        listArea.areaIdNomina == this.datosSP.cabecera.cabPagoIdAreaSolicitante
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

  widths: any = [];
  retornarTabla() {
    this.widths = [30, 120, 120, 70, 60, 56];
    const item = this.datosSP.detalles.sort(
      (a: any, b: any) => a.detPagoIdDetalle - b.detPagoIdDetalle
    );
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

    const cab = [
      { text: 'N°', style: 'tableHeader' },
      { text: 'ITEM', style: 'tableHeader' },
      { text: 'CANTIDAD CONTRATADA', style: 'tableHeader' },
      { text: 'CANTIDAD RECIBIDA', style: 'tableHeader' },
      { text: 'VALOR UNITARO', style: 'tableHeader' },
      { text: 'SUBTOTAL', style: 'tableHeader' },
    ];
    this.combinarObJ.push(cab);

    let detPagoIdDetalle = 1;
    for (let index = 0; index < datosDetalles.length; index++) {
      const {

        detPagoItemDesc,
        detPagoCantContratada,
        detPagoCantRecibida,
        detPagoValUnitario,
        detPagoSubtotal,
      } = datosDetalles[index];
      const datos = [
        { text: detPagoIdDetalle++ },
        { text: detPagoItemDesc },
        { text: detPagoCantContratada },
        { text: detPagoCantRecibida },
        { text: detPagoValUnitario },
        { text: detPagoSubtotal },
      ];
      this.combinarObJ.push(datos);
    }
  }


  ////////////////////////////////////////////////////FORMATEAR FACTURAS//////////////////////////////////////////
  formatearFacturasPdf() {

    this.widths = [75, 75, 80, 80, 90, 56];

    const factura = this.datosSP.facturas;
    //eliminar "T00:00:00" de las fechas


    let facturasList = factura.map((item: any) => {
      return {
        factSpId: item.factSpId,
        factSpNumOrdenCompra: item.factSpNumOrdenCompra,
        factSpNumFactura: item.factSpNumFactura,
        factSpFechaFactura: item.factSpFechaFactura.substring(0, 10),
        factSpRucProvFactura: item.factSpRucProvFactura,
        factSpProvFactura: item.factSpProvFactura,
        factSpMontoFactura: item.factSpMontoFactura
      };
    });

    const cab = [
      { text: 'OC', style: 'tableHeader' },
      { text: 'N° FACTURA', style: 'tableHeader' },
      { text: 'FECHA', style: 'tableHeader' },
      { text: 'RUC', style: 'tableHeader' },
      { text: 'PROVEEDOR', style: 'tableHeader' },
      { text: 'MONTO', style: 'tableHeader' },
    ];
    //guarda el objeto de la cabecera en el array
    this.combinarObJ.push(cab);

    for (let index = 0; index < facturasList.length; index++) {
      const {
        factSpId,
        factSpNumOrdenCompra,
        factSpNumFactura,
        factSpFechaFactura,
        factSpRucProvFactura,
        factSpProvFactura,
        factSpMontoFactura
      } = facturasList[index];
      const datos = [
        { text: factSpNumOrdenCompra },
        { text: factSpNumFactura },
        { text: factSpFechaFactura },
        { text: factSpRucProvFactura },
        { text: factSpProvFactura },
        { text: factSpMontoFactura },
      ];

      //guarda las listas de facturas en el array
      this.combinarObJ.push(datos);

      //por cada factura guardada va a buscar los detalles de la factura y guardarlos en el array
      const detalleFactura = this.datosSP.detalleFacturas;

      let detalleFacturaList = detalleFactura.map((item: any) => {
        return {
          detFactIdFactura: item.detFactIdFactura,
          detFactIdProducto: item.detFactIdProducto,
          detFactDescpProducto: item.detFactDescpProducto,
          detFactCantProducto: item.detFactCantProducto,
          detFactValorUnit: item.detFactValorUnit,
          detFactDescuento: item.detFactDescuento,
          detFactTotal: item.detFactTotal
        };
      });

      for (let index = 0; index < detalleFacturaList.length; index++) {

        const {
          detFactIdProducto,
          detFactDescpProducto,
          detFactCantProducto,
          detFactValorUnit,
          detFactDescuento,
          detFactTotal
        } = detalleFacturaList[index];

        if (detalleFacturaList[index].detFactIdFactura == factSpId) {
          const datos = [
            { text: factSpNumFactura },
            { text: detFactDescpProducto },
            { text: detFactCantProducto },
            { text: detFactValorUnit },
            { text: detFactDescuento },
            { text: detFactTotal },
          ];
          this.detallesFact.push(datos);
        }

      }
    }
  }

  detallesFact: any = [];
  cabeceraDetalles: any = []
  cabeceraDetallesFact: any = {};

  formatearDetalleFacturasPdf() {
    this.cabeceraDetalles = [
      { text: 'FACTURA', bold: true },
      { text: 'DESCRIPCION', bold: true },
      { text: 'CANTIDAD', bold: true },
      { text: 'PRECIO UNITARIO', bold: true },
      { text: 'DESCUENTO', bold: true },
      { text: 'SUBTOTAL', bold: true }
    ]

    this.cabeceraDetallesFact = {
      margin: [0, 10, 0, 0],
      text: 'Detalles de facturas',
      bold: true,
      alignment: 'center',
      pageBreak: 'before',
      widths: [30, 120, 120, 70, 60, 56],
    }
  }

  // this.datosSP.cabecera.cabPagoCancelacionOrden
  CancelarOrden(orden: string): string {
    switch (orden) {
      case 'TTL':
        return 'TOTAL';
      case 'PCL':
        return 'PARCIAL';
      default:
        return ''; // Manejo por defecto si el valor no es A, F o C
    }
  }
  Aprobado() {
    if (this.datosSP.cabecera.cabPagoApprovedBy === 'XXXXXX') {
      //console.log('entro', this.datosSP.cabecera.cabPagoApprovedBy);
      this.datosSP.cabecera.cabPagoApprovedBy = 'NIVEL NO ALCANZADO';
    } else {
      for (const iterator of this.empleadoedit) {
        if (
          iterator.empleadoIdNomina ==
          this.datosSP.cabecera.cabPagoApprovedBy
        ) {
          this.datosSP.cabecera.cabPagoApprovedBy =
            iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
        }
      }
    }
  }
  clear() {
    this.datosSP = { cabecera: {}, detalles: [], facturas: [], detalleFacturas: [] };
    this.combinarObJ = [];
  }
  async convertImageToDataUrl(imagePath: string): Promise<string> {
    try {
      const response = await fetch(imagePath);
      const arrayBuffer = await response.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      return dataUrl;
    } catch (error) {
      console.error('Error al cargar y convertir la imagen:', error);
      throw error; // Lanza el error para que sea manejado por la parte que llama a esta función.
    }
  }
  traerdatos() {
    this.convertImageToDataUrl(this.Imagen).then((dataurl) => {
      this.copiaImgen = dataurl;
    });
  }


  //setea la informacion de las facturas en la tabla
  setFacturasInfo(){
    this.facturasInfo = [[
      { text: 'NO DE FACTURA ', style: 'tableHeader' },
      { text: this.datosSP.cabecera.cabPagoNumFactura },
      { text: 'FECHA DE FACTURA', style: 'tableHeader', visible: this.showFactInfo },
      { text: (this.datosSP.cabecera.cabPagoFechaFactura === null ? 'Sin fecha' : format(parseISO(this.datosSP.cabecera.cabPagoFechaFactura), 'yyyy-MM-dd')),
        colSpan: 2 },
      '',
    ]]
  }

  async getFechaCompras(): Promise<Date> {
  
    return new Promise<Date>((resolve, reject) => {
      this.solTimeService.getFechabyNivel(this.datosSP.cabecera.cabPagoTipoSolicitud, this.datosSP.cabecera.cabPagoNoSolicitud, 50).subscribe({
        next: (res) => {
          console.log('Respuesta:', res);
          resolve(new Date(res)); // Resuelve la promesa con la fecha obtenida
        },
        error: (err) => {
          console.error('Error:', err);
          reject(err); // Rechaza la promesa en caso de error
        },
      });
    });
  }
}
