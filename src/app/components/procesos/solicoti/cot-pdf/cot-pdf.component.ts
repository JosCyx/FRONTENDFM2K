import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { GlobalService } from 'src/app/services/global.service';
import { ca, da } from 'date-fns/locale';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface SolicitudData {
  cabecera: any;
  detalles: any[];
  items: any;
}
@Component({
  selector: 'app-cot-pdf',
  templateUrl: './cot-pdf.component.html',
  styleUrls: ['./cot-pdf.component.css'],
})
export class CotPdfComponent implements OnInit {
  //variables
  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  CabCotiza: string = 'SOLICITUD DE COTIZACIONES';
  //global
  solID: number = this.serviceGlobal.solID;
  //guardar array de datos
  empleadosEdit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];
  emptyObjects: any = [
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
    {
      text: '',
    },
    {
      text: '',
    },
  ];
  datosMapeados!: any[];
  //variables
  empleados: string = '';
  areas: string = '';
  nivelRuta: string = '';
  //varuables
  datosCabcot!: SolicitudData;
  constructor(
    private serviceCabCo: CabCotizacionService,
    private serviceGlobal: GlobalService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService
  ) {}
  ngOnInit(): void {
    this.empService.getEmpleadosList().subscribe((data) => {
      this.empleadosEdit = data;
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

  clickpdf() {
    this.serviceCabCo.getCotizacionbyId(this.solID).subscribe({
      next: (res) => {
        this.datosCabcot = res;
      },
      error: (err) => {
        console.error('este es mi error ', err);
      },
    });
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
                {
                  text: this.formatDateToSpanish(
                    new Date(this.datosCabcot.cabecera.cabSolCotFecha)
                  ),
                },
                { text: 'SOLICITADO POR :' },
                { text: this.empleados, colSpan: 2 },
                {},
              ],
              [
                { text: 'AREA:' },
                { text: this.areas },
                { text: 'ESTADO:' },
                { text: this.estadoTexto(), colSpan: 2 },
                '',
              ],
              [
                { text: 'APROBADO POR :' },
                { text: '' },
                { text: 'TRACKING' },
                { text: this.nivelRuta, colSpan: 2 },
                '',
              ],
              [
                { text: 'ASUNTO' },
                {
                  text: this.datosCabcot.cabecera.cabSolCotAsunto,
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
               [{text:this.retornar()}, {}, {}, {}, { text: '', colSpan: 2 }, ''],
              ,
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
  //Metodos
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
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  imprimir() {
    console.log(this.solID);
    this.serviceCabCo.getCotizacionbyId(this.solID).subscribe({
      next: (res) => {
        console.log('data', res);
        this.datosCabcot = res;
        this.traerEmpleado();
        this.TraerArea();
        this.EstadoTracking();
      },
      error: (err) => {
        console.error('este es mi error ', err);
      },
    });
    //empleados
  }
  traerEmpleado() {
    for (let emp of this.empleadosEdit) {
      if (
        emp.empleadoIdNomina == this.datosCabcot.cabecera.cabSolCotSolicitante
      ) {
        this.empleados = emp.empleadoNombres + ' ' + emp.empleadoApellidos;
        console.log('CAMVBIOSD ', this.empleados);
      }
    }
  }
  TraerArea() {
    for (const listArea of this.area) {
      if (listArea.areaIdNomina == this.datosCabcot.cabecera.cabSolCotArea) {
        this.areas = listArea.areaDecp;
      }
    }
  }
  estadoTexto(): string {
    switch (this.datosCabcot.cabecera.cabSolCotEstado) {
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
      if (NvTrk.nivel === this.datosCabcot.cabecera.cabSolCotEstadoTracking) {
        this.nivelRuta = NvTrk.descRuteo;
      }
    }
  }
  retornar() {
    this.datosMapeados = this.datosCabcot.items.map((element: any,index:any) => {
      console.log('elemesntos sfsdf', element);
      const { itmCantidad, itmID, itmIdDetalle, itmIdItem, itmNumSol, itmSector } = element;
      return {
        text: `itmCantidad: ${itmCantidad}, itmID: ${itmID}, itmIdDetalle: ${itmIdDetalle}, itmIdItem: ${itmIdItem}, itmNumSol: ${itmNumSol}, itmSector: ${itmSector}`
      };
    });
    console.log("cffdfd",this.emptyObjects)
    for (const iterator of this.datosMapeados) {
      console.log('este es midfdf isdfdsndexsdfsddsf', iterator);
    }
    // for (let index = 0; index < this.datosMapeados.length; index++) {
    //   console.log('este es midfdf index', this.datosMapeados);
    // }
    // return cantidad;
  }
}
