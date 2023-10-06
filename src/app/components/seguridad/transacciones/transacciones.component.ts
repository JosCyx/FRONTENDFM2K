import { Component, OnInit } from '@angular/core';
import { set } from 'date-fns';
import { th } from 'date-fns/locale';
import { AplicacionesService } from 'src/app/services/comunicationAPI/seguridad/aplicaciones.service';
import { TransaccionesService } from 'src/app/services/comunicationAPI/seguridad/transacciones.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css'],
})
export class TransaccionesComponent implements OnInit {
  changeview: string = 'consulta';
  currentPage: number = 1;
  //Variables
  roCodigo: number = 0;
  nombre: string = '';
  aplicacion: number = 0;
  estado: string = '';
  //mensaje de exito o error
  showmsj: boolean = false;
  mensajeExito: string = '';
  showmsjerror: boolean = false;
  msjError: string = '';
  //Array de lista Transacciones
  transaccionesList: any[] = [];
  appList: any[] = [];
  constructor(
    private transService: TransaccionesService,
    private appService: AplicacionesService
  ) {}
  ngOnInit(): void {
    this.appService.getAplicacionesList().subscribe({
      next: (apps) => {
        this.appList = apps;
      },
      error: (err) => {
        console.error('error', err);
      },
      complete: () => {
        console.log('proceso completado');
      },
    });
    this.transService.getTransaccionesList().subscribe({
      next: (trans) => {
        this.transaccionesList = trans;
      },
      error: (err) => {
        console.error('error', err);
      },
      complete: () => {
        console.log('proceso completado');
      },
    });
  }
  //
  nextPage(): void {
    console.log('nextPage', this.currentPage);
    if (this.transaccionesList.length <= 10) {
      console.log('condicion1');
      this.currentPage = 1;
    } else if (this.currentPage >= this.transaccionesList.length / 10) {
      this.currentPage = this.currentPage;
      console.log('condicion2');
    } else {
      console.log('condicion3');
      this.currentPage++;
    }
  }
  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }
  //
  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
    this.nombre = '';
    this.aplicacion = 0;
    this.estado = '';
    this.changeview = view;
  }
  cancelar(): void {
    // this.nombre = '';
    // this.nemonico = '';
    // this.estado = '';
    // this.version = '';
    this.changeview = 'consulta';
  }
  agregarTran() {
    const data = {
      trEmpresa: 1,
      trAplicacion: this.aplicacion,
      trFuncion: 1,
      trNombre: this.nombre.trim(),
      trEstado: this.estado,
    };
    console.log(data);
    this.transService.addtransacciones(data).subscribe({
      next: (data) => {
        console.log('Transaccion agregada', data);
        this.showmsj = true;
        this.mensajeExito = 'Transaccion agregada exitosamente';
        setTimeout(() => {
          this.nombre = '';
          this.aplicacion = 0;
          this.estado = '';
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.showmsjerror = true;
        this.msjError = 'Error al agregar';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 2000);
      },
      complete: () => {
        console.log('proceso completado');
      },
    });
    
  }
  editarTran(rol: any): void {
    this.roCodigo = rol.trCodigo;
    this.nombre = rol.trNombre;
    this.aplicacion = rol.trAplicacion;
    this.estado = rol.trEstado;
    this.changeview = 'editar';
  }
  guardarEdicion() {
    const data = {
      trEmpresa: 1,
      trAplicacion: this.aplicacion,
      trFuncion: 1,
      trCodigo: this.roCodigo,
      trNombre: this.nombre.trim(),
      trEstado: this.estado,
    };
    console.log('dattos editadps', data);
    this.transService.updatetransacciones(this.roCodigo, data).subscribe({
      next: (response) => {
        this.showmsj = true;
        this.mensajeExito = 'Transaccion editada exitosamente';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.showmsjerror = true;
        this.msjError = 'Error al editar';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 2000);
      },
      complete: () => {
        console.log('proceso completado');
      },
    });
  }
}
