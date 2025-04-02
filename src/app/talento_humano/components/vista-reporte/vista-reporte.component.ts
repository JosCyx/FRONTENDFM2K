import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ReporteAusService } from 'src/app/services/comunicationAPI/tthh/reporte-aus.service';
import { GlobalAusService } from 'src/app/services/global-aus.service';

interface RangoMensual {
  fechaInicio: Date | string;
  fechaFin: Date | string;
}

interface DataResultado {
  Nombre: string;
  Total: number;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-vista-reporte',
  templateUrl: './vista-reporte.component.html',
  styleUrls: ['./vista-reporte.component.css'],
  providers: [DatePipe],
})
export class VistaReporteComponent implements OnInit {
  opSelected = signal<number>(1);
  opList: WritableSignal<any[]> = signal<any[]>([1, 2]);
  selectedFechaInicio = signal<Date | null>(null);
  selectedFechaFin = signal<Date | null>(null);
  selectedFechaInicioFormateada = signal<string | null>(null);
  selectedFechaFinFormateada = signal<string | null>(null);
  ReporList = signal<DataResultado[]>([]);
  constructor(
    private cookieService: CookieService,
    private ReporteAusentismo: ReporteAusService,
    private globalAusService: GlobalAusService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    effect(() => {
      console.log(
        'CAMBIOWSWS',
        this.selectedFechaInicio(),
        this.selectedFechaFin(),
        this.opSelected()
      );
      console.log(
        'formato',
        this.opSelected(),
        this.selectedFechaInicioFormateada(),
        this.selectedFechaFinFormateada()
      );
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      const { fechaInicio, fechaFin } = this.calcularRangoMensual(new Date());
      this.selectedFechaInicio.set(fechaInicio as Date);
      this.selectedFechaFin.set(fechaFin as Date);
      this.selectedFechaInicioFormateada.set(
        this.datePipe.transform(fechaInicio, 'yyyy, MM dd') || ''
      );
      this.selectedFechaFinFormateada.set(
        this.datePipe.transform(fechaFin, 'yyyy, MM dd') || ''
      );
      this.Reportes(this.opList()[0]);
    }, 200);
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  onOpChange() {
    console.log(
      'opSsfdsdfdfdfdfdelected',
      this.opSelected(),
      this.selectedFechaInicio(),
      this.selectedFechaFin()
    );
    this.opSelected.update((prev) => {
      return prev === this.opList()[0] ? this.opList()[1] : this.opList()[0];
    });
    if (
      this.selectedFechaInicio() &&
      this.selectedFechaFin() &&
      this.opSelected()
    ) {
      console.log('enntrar aqui');

      // this.Reportes();
    }
  }
  onchangeFechaInicio(event: Date) {
    console.log('event', event);
    this.selectedFechaInicio.update(() => event);
    this.selectedFechaInicioFormateada.update(
      () => this.datePipe.transform(event, 'yyyy, MM dd') || ''
    );
  }
  onchangeFechaFin(event: Date) {
    this.selectedFechaFin.update(() => event);
    this.selectedFechaFinFormateada.update(
      () => this.datePipe.transform(event, 'yyyy, MM dd') || ''
    );
  }

  Reportes(opSelecte: number) {
    console.log('gesedwt', opSelecte);
    this.ReporteAusentismo.getReporteAusentismo(
      this.selectedFechaInicioFormateada(),
      this.selectedFechaFinFormateada(),
      opSelecte
    ).subscribe({
      next: (data: any) => {
        console.log('Reporte', data);
        this.ReporList.set(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
    console.log('Repdssdsdsorte', this.ReporList());
  }

  calcularRangoMensual(fechaReferencia: Date): RangoMensual {
    const fechaInicio = new Date(
      fechaReferencia.getFullYear(),
      fechaReferencia.getMonth(),
      1
    ); // Primer día del mes
    const fechaFin = new Date(
      fechaReferencia.getFullYear(),
      fechaReferencia.getMonth() + 1,
      0
    ); // Último día del mes
    return { fechaInicio, fechaFin };
  }
}
