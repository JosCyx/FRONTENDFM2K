import { Component, Input, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';

@Component({
  selector: 'app-sp-destino',
  templateUrl: './sp-destino.component.html',
  styleUrls: ['./sp-destino.component.css']
})
export class SpDestinoComponent implements OnInit {
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  @Input() estadoSol!: string;
  @Input() areaSol!: number;

  private inputTimer: any;
  empleados!: any[];
  sectores!: any[];
  empleadoBusq!: string;

  //variables para guardar los datos del destino
  sectorDestino: number = 9999;
  empleadoDestino!: number;
  observacionesDestino!: string;
  
  constructor(private sectoresService: SectoresService,
              private empleadoService: EmpleadosService) { }


  ngOnInit(): void {
    this.sectoresService.getSectoresList().subscribe((data: any[]) => {
      this.sectores = data;
    }, (error) => {
      console.log(error);
    });

    this.empleadoService.getEmpleadobyArea(this.areaSol).subscribe((data: any[]) => {
      this.empleados = data;
    } , (error) => {
      console.log(error);
    });

  }


  searchEmpleado(): void {
    if (this.empleadoBusq.length > 2) {
      this.empleadoService.getEmpleadobyArea(this.areaSol).subscribe((data: any[]) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }

  }


  onInputChanged(): void {
    // Cancelamos el temporizador anterior antes de crear uno nuevo
    clearTimeout(this.inputTimer);

    // Creamos un nuevo temporizador que ejecutará el método después de 1 segundo
    this.inputTimer = setTimeout(() => {
      // Coloca aquí la lógica que deseas ejecutar después de que el usuario haya terminado de modificar el input
      if (this.empleadoBusq) {
        const empleadoSeleccionado = this.empleados.find(emp => (emp.empleadoNombres + ' ' + emp.empleadoApellidos) === this.empleadoBusq);
        this.empleadoDestino = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdNomina : 'No se ha encontrado el inspector';
        
      } else {
        this.empleadoDestino = 0;
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }
}
