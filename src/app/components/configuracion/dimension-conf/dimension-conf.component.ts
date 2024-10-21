import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DimensionesService } from 'src/app/services/dimensiones.service';
interface PSA {
  idProyecto: number;
  idSector: number;
  idActividad: number;
}

@Component({
  selector: 'app-dimension-conf',
  templateUrl: './dimension-conf.component.html',
  styleUrls: ['./dimension-conf.component.css']
})
export class DimensionConfComponent {
  displayedColumns: string[] = ['proyecto', 'sector', 'actividad', 'opciones'];

  @ViewChild(MatPaginator) "paginator": MatPaginator;
  dataSource = new MatTableDataSource<any>();;

  proyectos: any[] = [];
  sectores: any[] = [];
  actividades: any[] = [];

  psaRelation: PSA = {
    idProyecto: 0,
    idSector: 0,
    idActividad: 0
  }

  constructor(
    private dimService: DimensionesService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dimService.getDimProyecto().subscribe(
        (data) => {
          this.proyectos = data;
        }
      );
      this.dimService.getDimSect().subscribe(
        (data) => {
          this.sectores = data;
        }
      );
      this.dimService.getDimAct().subscribe(
        (data) => {
          this.actividades = data;
        }
      );
      this.dimService.getPSARelations().subscribe(
        (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
        }
      );
    }, 300 );
  }

  addPSARelation(){
    if(this.psaRelation.idProyecto == 0 || this.psaRelation.idSector == 0 || this.psaRelation.idActividad == 0){
      alert("Por favor seleccione un proyecto, sector y actividad");
      return;
    }

    //verificar si el registro ya existe en el datasource
    const exists = this.dataSource.data.find(
      (d) => d.dimAcseprActividad == this.psaRelation.idActividad &&
      d.dimAcseprSector == this.psaRelation.idSector &&
      d.dimAcseprProyecto == this.psaRelation.idProyecto
    );

    if(exists){
      alert("La relacion PSA ya existe");
      return;
    }

    const data = {
      dimAcseprActividad:this.psaRelation.idActividad,
      dimAcseprSector: this.psaRelation.idSector,
      dimAcseprProyecto: this.psaRelation.idProyecto,
      dimAcseprDimPresp: 0
    };

    this.dimService.addPSARelation(data).subscribe(
      (response) => {
        console.log("Relacion PSA agregada:", response);
        this.dimService.getPSARelations().subscribe(
          (data) => {
            this.dataSource.data = data;
            this.dataSource.paginator = this.paginator;

            this.psaRelation = {
              idProyecto: 0,
              idSector: 0,
              idActividad: 0
            }
          }
        );
      },
      (error) => {
        if(error.status == 409){
          alert("La relacion PSA ya existe");
          return;
        } else {
          console.log("Error al agregar la relacion PSA:", error);
        }
      }
    );
  }

  //getProyectosName
  getProyectoName(id: number): string {
    return this.proyectos.find((p) => p.dimPrId == id).dimPrCodigo + ' - ' + this.proyectos.find((p) => p.dimPrId == id).dimPrDescripcion;
  }

  //getSectoresName
  getSectorName(id: number): string {
    return this.sectores.find((p) => p.dimSectId == id).dimSectCodigo + ' - ' + this.sectores.find((s) => s.dimSectId == id).dimSectDescripcion;
  }

  //getActividadesName
  getActividadName(id: number): string {
    return this.actividades.find((p) => p.dimActId == id).dimActCodigo + ' - ' + this.actividades.find((a) => a.dimActId == id).dimActDescripcion;
  }

  deletePSA(id: number){
    console.log("Id de la relacion PSA a eliminar:", id);
    this.dimService.deletePSARelation(id).subscribe( 
      (response) => {
        console.log("Relacion PSA eliminada:", response);
        this.dimService.getPSARelations().subscribe(
          (data) => {
            this.dataSource.data = data;
            this.dataSource.paginator = this.paginator;
          }
        );
      },
      (error) => {
        console.log("Error al eliminar la relacion PSA:", error);
      }
    )
  }

  
}
