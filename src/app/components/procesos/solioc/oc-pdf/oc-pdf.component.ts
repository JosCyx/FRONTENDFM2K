import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { map } from 'rxjs';
import { format, parseISO } from 'date-fns';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { PresupuestoService } from 'src/app/services/comunicationAPI/solicitudes/presupuesto.service';
import { GlobalService } from 'src/app/services/global.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';

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
  inspectoresEdit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];
  presupues: any[] = [];
  sectores: any[] = [];
  //variables de tabla detalle
  datosMapeados: any[] = [];
  combinarObJ: any = [];
  combinarSecto: any = [];
  Imagen:string='assets/img/icon.png';
  copiaImgen:string='';

  constructor(
    private serviceGlobal: GlobalService,
    private cabOCService: CabOrdCompraService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private prespService: PresupuestoService,
    private sectService: SectoresService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadoedit = data;
      });
      this.areaService.getAreaList().subscribe((data) => {
        this.area = data;
      });
      this.nivRuteService
        .getNivelruteo()
        .pipe(map((niv) => niv.sort((a, b) => a.nivel - b.nivel)))
        .subscribe((data) => {
          this.NivelRuta = data;
        });
      this.prespService.getPresupuestos().subscribe({
        next: (respuestas: any) => {
          this.presupues = respuestas;
        },
      });
      this.empService.getEmpleadosList().subscribe({
        next: (res) => {
          this.inspectoresEdit = res;
        },
      });
      this.sectService
        .getSectoresList()
        .pipe(
          map((sector) =>
            sector.sort((a, b) => a.sectNombre.localeCompare(b.sectNombre))
          )
        )
        .subscribe({
          next: (respuestas: any) => {
            this.sectores = respuestas;
          },
        });
    }, 200);
  }

  ClickPDF() {
    try {
      this.traerdatos();
      this.cabOCService.getOrdenComprabyId(this.solID).subscribe({
        next: (resp: any) => {
          this.datosCabOC = resp;
          //console.log('este es mi daros ', this.datosCabOC);
          this.traerEmpleado();
          this.TraerArea();
          this.EstadoTracking();
          this.RetornarOrdencompra();
          this.RetornarOrdencompraSub();
          this.BuscarInpector();
          this.Aprobado();
          this.financiero();
          const pdfc: any = {
            content: [
              {
                image: this.copiaImgen,
                width: 50,
                height: 50,
                margin: [0, 20],
              },
              { text: 'FUNDACION MALECON 2000', style: 'header' },
              {
                text: 'ORDEN DE COMPRA',
                alignment: 'center',
                style: 'subheader',
                margin: [0, 10, 0, 30],
              },
              {
                text: this.datosCabOC.cabecera.cabSolOCNumerico,
                alignment: 'right',
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
                      { text: this.datosCabOC.cabecera.cabSolOCApprovedBy },
                      { text: 'ESTADO:', style: 'tableHeader' },
                      { text: this.estadoTexto(), colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'FINANCIERO :', style: 'tableHeader' },
                      { text: this.datosCabOC.cabecera.cabSolOCFinancieroBy },
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
                    ...this.combinarObJ,
                    [
                      {
                        text: 'MATERIALES Y PROCEDIMIENTO A SEGUIR:',
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
                        text: this.datosCabOC.cabecera.cabSolOCProcedimiento,
                        colSpan: 5,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: 'OBSERVACIONES', style: 'textos', colSpan: 6 },
                      '',
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: '1' },
                      {
                        text: this.datosCabOC.cabecera.cabSolOCObervaciones,
                        colSpan: 5,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      {
                        text: 'ADJUNTO COTIZACIONES:',
                        style: 'textos',
                        colSpan: 2,
                      },
                      '',
                      { text: this.datosCabOC.cabecera.cabSolOCAdjCot },
                      {
                        text: 'NUMERO DE COTIZACIONES:',
                        colSpan: 2,
                        style: 'textos',
                      },
                      '',
                      { text: this.datosCabOC.cabecera.cabSolOCNumCotizacion },
                    ],
                  ],
                },
              },
              {
                margin: [0, 10, 0, 0],
                fontSize: 10,
                table: {
                  widths: [150, 87, 150, 87],
                  body: [
                    [
                      { text: 'PLAZO DE ENTREGA:', style: 'textos' },
                      {
                        text: (this.datosCabOC.cabecera.cabSolOCPlazoEntrega === null ? 'Sin fecha' :  format(
                          parseISO(this.datosCabOC.cabecera.cabSolOCPlazoEntrega),'yyyy-MM-dd')),
                        alignment: 'center',
                      },
                      { text: 'FECHA MAXIMA DE ENTREGA:', style: 'textos' },
                      {
                        text: (this.datosCabOC.cabecera.cabSolOCFechaMaxentrega === null ? 'Sin fecha' :  format(
                          parseISO(this.datosCabOC.cabecera.cabSolOCFechaMaxentrega),'yyyy-MM-dd')),
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
                  widths: [100, 200, 87, 87],
                  body: [
                    [
                      { text: 'INSPECTOR:', style: 'footer' },
                      { text: this.inpectores },
                      { text: 'TELEFONO:', style: 'footer' },
                      { text: this.datosCabOC.cabecera.cabSolOCTelefInspector },
                    ],
                  ],
                },
              },
              {
                margin: [0, 10, 0, 0],
                text: 'Desglose de Sectores',
                bold: true,
                alignment: 'center',
                pageBreak: 'before',
              },
              {
                table: {
                  body: [
                    [
                      { text: 'DESCRIPCION', bold: true },
                      { text: 'CANTIDAD', bold: true },
                      { text: 'SECTOR', bold: true },
                    ],
                    ...this.combinarSecto,
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
          pdf.download(this.datosCabOC.cabecera.cabSolOCNumerico);
          this.clear();
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
      if (listArea.areaIdNomina == this.datosCabOC.cabecera.cabSolOCIdArea) {
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

  //Retorna de la tabla Principal
  RetornarOrdencompra() {
    const detalles = this.datosCabOC.detalles;
    this.datosMapeados = detalles.map((item: any) => {
      return {
        solCotIdDetalle: item.solCotIdDetalle,
        solCotCantidadTotal: item.solCotCantidadTotal,
        solCotDescripcion: item.solCotDescripcion,
        solCotPresupuesto: item.solCotPresupuesto,
        solCotUnidad: item.solCotUnidad,
      };
    });
    //
    this.datosMapeados.sort((a, b) => a.solCotIdDetalle - b.solCotIdDetalle);
    //
    for (let i = 0; i < this.datosMapeados.length; i++) {
      let presuM = '';
      for (const iterator of this.presupues) {
        if (iterator.prespId == this.datosMapeados[i].solCotPresupuesto) {
          presuM = iterator.prespNombre;
        }
      }
      const {
        solCotIdDetalle,
        solCotCantidadTotal,
        solCotDescripcion,
        solCotUnidad,
      } = this.datosMapeados[i];
      const a = [
        { text: solCotIdDetalle, alignment: 'center' },
        { text: solCotDescripcion, alignment: 'left' },
        { text: presuM, alignment: 'right', colSpan: 2 },
        { text: '', alignment: 'center' },
        { text: solCotUnidad, alignment: 'center' },
        { text: solCotCantidadTotal, alignment: 'center' },
      ];
      this.combinarObJ.push(a);
    }
  }
  RetornarOrdencompraSub() {
    const item = this.datosCabOC.items;
    let arraysector = item.map((index: any) => {
      return {
        itmIdDetalle: index.itmIdDetalle,
        itmSector: index.itmSector,
        itmCantidad: index.itmCantidad,
      };
    });
    arraysector.sort((a:any, b:any) => a.itmIdDetalle - b.itmIdDetalle);
    for (let index = 0; index < arraysector.length; index++) {
      let descripcion = '';
      for (const iterator of this.datosMapeados) {
        if (iterator.solCotIdDetalle == arraysector[index].itmIdDetalle) {
          descripcion = iterator.solCotDescripcion;
        }
      }
      let sector = '';
      for (let iter of this.sectores) {
        if (iter.sectIdNomina == arraysector[index].itmSector) {
          sector = iter.sectNombre;
        }
      }
      const { itmCantidad } = arraysector[index];
      const a = [
        { text: descripcion, alignment: 'left' },
        { text: itmCantidad, alignment: 'center' },
        { text: sector, alignment: 'left' },
      ];
      this.combinarSecto.push(a);
    }
  }
  BuscarInpector() {
    for (const iterator of this.inspectoresEdit) {
      if (
        iterator.empleadoIdNomina == this.datosCabOC.cabecera.cabSolOCInspector
      ) {
        this.inpectores =
          iterator.empleadoNombres + ' ' + iterator.empleadoApellidos;
      }
    }
  }
  Aprobado(){
    if (this.datosCabOC.cabecera.cabSolOCApprovedBy === 'XXXXXX' ) {
      this.datosCabOC.cabecera.cabSolOCApprovedBy = 'NIVEL NO ALCANZADO';
    } else {
      for (const iterator of this.empleadoedit) {
        if (
          iterator.empleadoIdNomina ==
          this.datosCabOC.cabecera.cabSolOCApprovedBy
        ) {
          this.datosCabOC.cabecera.cabSolOCApprovedBy =
            iterator.empleadoNombres + '' + iterator.empleadoApellidos;
        }
      }
    }
  }
  financiero(){
    if (this.datosCabOC.cabecera.cabSolOCFinancieroBy === 'XXXXXX') {
      this.datosCabOC.cabecera.cabSolOCFinancieroBy = 'NIVEL NO ALCANZADO';
    }else{
      for(const itera of this.empleadoedit){
        if(itera.empleadoIdNomina==this.datosCabOC.cabecera.cabSolOCFinancieroBy){
          this.datosCabOC.cabecera.cabSolOCFinancieroBy=itera.empleadoNombres+' '+itera.empleadoApellidos;
        }
      }
    }
  }
  clear() {
    this.datosCabOC = { cabecera: {}, detalles: [], items: [] };
    this.combinarObJ = [];
    this.combinarSecto = [];
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
}
