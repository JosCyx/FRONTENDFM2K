import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { GlobalService } from 'src/app/services/global.service';
import { format, parseISO } from 'date-fns';
import { PresupuestoService } from 'src/app/services/comunicationAPI/solicitudes/presupuesto.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface SolicitudData {
  cabecera: any;
  detalles: any;
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
  CabCotiza: string = 'SOLICITUD DE COTIZACION';
  //global
  solID: number = this.serviceGlobal.solID;
  //guardar array de datos
  empleadosEdit: any[] = [];
  inspectoresEdit: any[] = [];
  area: any[] = [];
  NivelRuta: any[] = [];
  combinarObJ: any = [];
  combinarSecto: any = [];
  datosMapeados: any[] = [];
  nuevoArray: any[] = [];
  sectores: any[] = [];
  //variables
  empleados: string = '';
  inpectores: string = '';
  presupues: any[] = [];

  areas: string = '';
  nivelRuta: string = '';
  //varuables
  datosCabcot!: SolicitudData;
  constructor(
    private serviceCabCo: CabCotizacionService,
    private serviceGlobal: GlobalService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private prespService: PresupuestoService,
    private sectService: SectoresService,
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
    this.empService.getEmpleadobyArea(12).subscribe({
      next: (res) => {
        this.inspectoresEdit = res;
      },
    });
    this.prespService.getPresupuestos().subscribe({
      next: (respuestas: any) => {
        this.presupues = respuestas;
      },
    });
    this.sectService.getSectoresList().pipe(map(sector=>sector.sort((a,b)=>a.sectNombre.localeCompare(b.sectNombre)))).subscribe({
      next: (respuestas: any) => {
        this.sectores = respuestas;
      }
    });
  }

    clickpdf() {
      this.serviceCabCo.getCotizacionbyId(this.solID).subscribe({
      next: (res) => {
        this.datosCabcot = res;
        //console.log("esto son mismos",this.datosCabcot)
          this.traerEmpleado();
          this.TraerArea();
          this.EstadoTracking();
          this.BuscarInpector();
          this.retornar();
          this.retornarSub();
          this.Aprobado();
          this.financiero();
          const dd: any = {
            content: [
              // {
              //   image: 'src\assets\img\icon.jpg',
              //   //  image: 'src\assets\img\icon.png',
              //   margin: [0, 20],
              // },
              { text: 'FUNDACION MALECON 2000', style: 'header' },
      
              {
                text: this.CabCotiza,
                alignment: 'center',
                style: 'subheader',
                margin: [0, 10, 0, 30],
              },
              {
                text: this.datosCabcot.cabecera.cabSolCotNumerico,
                alignment: 'right',
                margin: [0, 0, 10, 5],
              },
              {
                fontSize: 10,
                table: {
                  widths: [90, 160, 60, 70, 85],
                  body: [
                    [
                      { text: 'FECHA:', style: 'tableHeader' },
                      {
                        text: this.formatDateToSpanish(
                          new Date(this.datosCabcot.cabecera.cabSolCotFecha)
                        ),
                      },
                      { text: 'AREA:', style: 'tableHeader' },
                      { text: this.areas, colSpan: 2 },
      
                      {},
                    ],
                    [
                      { text: 'SOLICITADO POR :', style: 'tableHeader' },
                      { text: this.empleados, colSpan: 4 },
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: 'APROBADO POR :', style: 'tableHeader' },
                      { text: this.datosCabcot.cabecera.cabSolCotApprovedBy},
                      { text: 'ESTADO:', style: 'tableHeader' },
                      { text: this.estadoTexto(), colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'FINANCIERO :', style: 'tableHeader' },
                      { text: this.datosCabcot.cabecera.cabSolCotFinancieroBy },
                      { text: 'TRACKING', style: 'tableHeader' },
                      { text: this.nivelRuta, colSpan: 2 },
                      '',
                    ],
                    [
                      { text: 'ASUNTO', style: 'tableHeader' },
                      {
                        text: this.datosCabcot.cabecera.cabSolCotAsunto,
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
                    //  [{}, {}, {}, {}, { text: '', colSpan: 2 }, ''],
                    ...this.combinarObJ,
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
                        text: this.datosCabcot.cabecera.cabSolCotProcedimiento,
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
                        text: this.datosCabcot.cabecera.cabSolCotObervaciones,
                        colSpan: 5,
                      },
                      '',
                      '',
                      '',
                      '',
                    ],
                    [
                      { text: 'ADJUNTO COTIZACIONES:', style: 'textos', colSpan: 2 },
                      '',
                      { text: this.datosCabcot.cabecera.cabSolCotAdjCot },
                      {
                        text: 'NUMERO DE COTIZACIONES:',
                        colSpan: 2,
                        style: 'textos',
                      },
                      '',
                      { text: this.datosCabcot.cabecera.cabSolCotNumCotizacion },
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
                        text: (this.datosCabcot.cabecera.cabSolCotPlazoEntrega =
                          format(
                            parseISO(this.datosCabcot.cabecera.cabSolCotPlazoEntrega),
                            'yyyy-MM-dd'
                          )),
                        alignment: 'center',
                      },
                      { text: 'FECHA MAXIMA DE ENTREGA:', style: 'textos' },
                      {
                        text: (this.datosCabcot.cabecera.cabSolCotFechaMaxentrega =
                          format(
                            parseISO(
                              this.datosCabcot.cabecera.cabSolCotFechaMaxentrega
                            ),
                            'yyyy-MM-dd'
                          )),
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
                      { text: this.datosCabcot.cabecera.cabSolCotTelefInspector },
                    ],
                  ],
                },
              },
              {
                margin: [0, 10, 0, 0],
                text: 'Desglose de Sectores',
                bold:true,
                alignment:'center',
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
                    ...this.combinarSecto
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
          pdf.download(this.datosCabcot.cabecera.cabSolCotNumerico);
          this.clear();
      },
      error: (err) => {
        console.error('este es mi error ', err);
      },
    });
     
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
  traerEmpleado() {
    for (let emp of this.empleadosEdit) {
      if (
        emp.empleadoIdNomina == this.datosCabcot.cabecera.cabSolCotSolicitante
      ) {
        this.empleados = emp.empleadoNombres + ' ' + emp.empleadoApellidos;
      }
    }
  }
  TraerArea() {
    for (const listArea of this.area) {
      if (listArea.areaIdNomina == this.datosCabcot.cabecera.cabSolCotIdArea) {
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
    const detalles = this.datosCabcot.detalles;
    this.datosMapeados = detalles.map((index: any) => {
      return {
        solCotIdDetalle: index.solCotIdDetalle,
        solCotDescripcion: index.solCotDescripcion,
        solCotPresupuesto: index.solCotPresupuesto,
        solCotUnidad: index.solCotUnidad,
        solCotCantidadTotal: index.solCotCantidadTotal,
      };
    });
    this.datosMapeados.sort((a, b) => a.solCotIdDetalle - b.solCotIdDetalle);
    for (let index = 0; index < this.datosMapeados.length; index++) {
      let presuM = '';
      for (const iterator of this.presupues) {
        if (iterator.prespId == this.datosMapeados[index].solCotPresupuesto) {
          presuM = iterator.prespNombre;
        }
      }
      const {
        solCotIdDetalle,
        solCotDescripcion,
        solCotUnidad,
        solCotCantidadTotal,
      } = this.datosMapeados[index];
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
  retornarSub() {
      const item = this.datosCabcot.items;
      let arraysector=item.map((index:any)=>{
        return{
          itmIdDetalle:index.itmIdDetalle,
          itmSector:index.itmSector,
          itmCantidad:index.itmCantidad,

        }
      })
      arraysector.sort((a:any,b:any)=>a.itmIdDetalle-b.itmIdDetalle);
      for(let index=0; index< arraysector.length; index++){
        let descripcion='';
        for (const iterator of this.datosMapeados) {
          if(iterator.solCotIdDetalle==arraysector[index].itmIdDetalle){
            descripcion=iterator.solCotDescripcion;
          }
        }
        let sector='';
        for (const iterator of this.sectores) {
          if (iterator.sectIdNomina == arraysector[index].itmSector ) {
            sector = iterator.sectNombre;
          }
        }
        const {itmCantidad}=arraysector[index];
        const a=[
          {text:descripcion,alignment:'center'},
          {text:itmCantidad,alignment:'center'},
          {text:sector,alignment:'left'},
        ]
        this.combinarSecto.push(a);
      }
  }
  BuscarInpector() {
    for (const iterator of this.inspectoresEdit) {
      if (
        iterator.empleadoIdNomina ==
        this.datosCabcot.cabecera.cabSolCotInspector
      ) {
        this.inpectores =
          iterator.empleadoNombres + '' + iterator.empleadoApellidos;
      }
    }
  }
  Aprobado(){
    if (this.datosCabcot.cabecera.cabSolCotApprovedBy === '000000' ) {
      this.datosCabcot.cabecera.cabSolCotApprovedBy = 'NIVEL NO ALCANZADO';
    } else {
      for (const iterator of this.empleadosEdit) {
        if (
          iterator.empleadoIdNomina ==
          this.datosCabcot.cabecera.cabSolCotApprovedBy
        ) {
          this.datosCabcot.cabecera.cabSolCotApprovedBy =
            iterator.empleadoNombres + '' + iterator.empleadoApellidos;
        }
      }
    }
  }
  financiero(){
    if (this.datosCabcot.cabecera.cabSolCotFinancieroBy === '000000') {
      this.datosCabcot.cabecera.cabSolCotFinancieroBy = 'NIVEL NO ALCANZADO';
    }else{
      for(const itera of this.empleadosEdit){
        if(itera.empleadoIdNomina==this.datosCabcot.cabecera.cabSolCotFinancieroBy){
          this.datosCabcot.cabecera.cabSolCotFinancieroBy=itera.empleadoNombres+' '+itera.empleadoApellidos;
        }
      }
    }
  }
  clear() {
    this.datosCabcot = { cabecera: {}, detalles: [], items: [] };
    this.combinarObJ = [];
    this.combinarSecto=[];
  }

}
