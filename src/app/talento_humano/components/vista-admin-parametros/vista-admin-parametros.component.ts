import { Component } from '@angular/core';
import { co } from '@fullcalendar/core/internal-common';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';

@Component({
  selector: 'app-vista-admin-parametros',
  templateUrl: './vista-admin-parametros.component.html',
  styleUrls: ['./vista-admin-parametros.component.css']
})
export class VistaAdminParametrosComponent {
  paramId: number = 0;
  nombre: string = '';
  valor: number = 0;
  parametroList: any[] = [];

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  mensajeExito: string = '';
  msjError: string = '';
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  currentPage: number = 1;
  
  constructor(private ausentismoService: AusentismosService) {}

  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
    this.nombre = '';
    this.valor = 0;
    this.changeview = view;
  }
  
  ngOnInit() { 
    setTimeout(() => {
      this.ausentismoService.getParamList().subscribe({
        next: (parametros: any[]) => {
          this.parametroList = parametros;
          console.log("parametros", this.parametroList);
        },
        error: (err) => {
          console.log("error", err);
        }
      });
    }, 100);
  }

  guardarParam(){
    const data = {
      paramNombre: this.nombre,
      paramValor: this.valor
    };

    this.ausentismoService.postParametro(data).subscribe(
      (res: any) => {
        this.showmsj = true;
        this.mensajeExito = 'Motivo registrado exitosamente.';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 3000);

      },
      (error) => {
        console.error("Error al guardar el parametro:", error);
      }
    );
  }

  editarParam(parametro: any) {
    this.paramId= parametro.paramId;
    this.nombre = parametro.paramNombre;
    this.valor = parametro.paramValor;
    this.changeview = 'editar';
  }

  guardarEdicion(){
    const data = {
      paramId: this.paramId,
      paramNombre: this.nombre,
      paramValor: this.valor
    };
    console.log("data", data);
    this.ausentismoService.updateParametro(this.paramId, data).subscribe(
      (res: any) => {
        this.showmsj = true;
        this.mensajeExito = 'Motivo registrado exitosamente.';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 3000);
      },
      (error) => {
        console.error("Error al guardar el parametro:", error);
        this.showmsjerror = true;
        this.msjError = "Error al editar";
      }
    );
  }
  cancelar():void{
    this.nombre='';
    this.changeview = 'consulta';
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      console.log("prevPage", this.currentPage);
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }
  nextPage(): void {
    console.log("nextPage", this.currentPage);
    if (this.parametroList.length <= 10) {
      this.currentPage = 1;
    } else if (this.currentPage >= this.parametroList.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++
    }
  }
}
