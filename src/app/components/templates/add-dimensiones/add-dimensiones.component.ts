import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { DimensionesService } from 'src/app/services/dimensiones.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-dimensiones',
  templateUrl: './add-dimensiones.component.html',
  styleUrls: ['./add-dimensiones.component.css']
})
export class AddDimensionesComponent {
  dimPresp: number = 0;
  dimPrespName: string = '';
  dimSubActName: string = '';
  dimActName: string = '';
  dimSectName: string = '';
  dimProyName: string = '';

  proyectos: any[] = [];
  proyectosfiltered: any[] = [];
  sectores: any[] = [];
  sectoresfiltered: any[] = [];
  actividades: any[] = [];
  actividadesfiltered: any[] = [];
  subactividades: any[] = [];
  subactividadesfiltered: any[] = [];

  presupuestos: any[] = [];
  prespFiltered: any[] = [];

  projectSelected: number = 0;
  constructor(
    private dialogRef: MatDialogRef<AddDimensionesComponent>,
    private dimService: DimensionesService,
    public globalService: GlobalService,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit() {
    //CARGAR DIMENSIONES DE LA SOLICITUD
    this.dimService.getDimPresupuesto().subscribe(
      (data) => {
        //console.log("presupuestos:",data);
        this.presupuestos = data;
        /*console.log(this.presupuestos);

        console.log(this.presupuestos[0].dimDimprepIfProyecto);*/

        this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 1);

        //this.filterPresupuestos({ checked: false });
      },
      (error) => {
        console.error(error);
      }
    );

    this.dimService.getDimProyecto().subscribe(
      (data) => {
        //console.log("proyectos:",data);
        this.proyectos = data;
        this.proyectosfiltered = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.dimService.getDimSubAct().subscribe(
      (data) => {
        //console.log("subactividades:",data);
        this.subactividades = data;
        this.subactividadesfiltered = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.dimService.getDimAct().subscribe(
      (data) => {
        //console.log("actividades:",data);
        this.actividades = data;
        this.actividadesfiltered = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.dimService.getDimSect().subscribe(
      (data) => {
        //console.log("sectores:",data);
        this.sectores = data;
        this.sectoresfiltered = data;
      },
      (error) => {
        console.error(error);
      }
    );

    //VERIFICA SI HAY DIMENSIONES SETEADAS EN EL SERVICIO GLOBAL
    setTimeout(() => {
      if (this.globalService.isDimSetted) {
        this.getDimNames()
      }
    }, 300);
  }

  checkProyecto: boolean = false;

  //leer los valores de las dimensiones de la solicitud y buscar su nombre
  getDimNames() {
    //BUSCA EL NOMBRE DE LAS DIMENSIONES 
    //presupuesto
    this.dimPrespName = this.presupuestos.find(
      (p) => p.dimDimprepId == this.globalService.solDimensiones.dimPresupuesto
    ).dimDimprepCodigo + ' - ' + this.presupuestos.find(
      (p) => p.dimDimprepId == this.globalService.solDimensiones.dimPresupuesto
    ).dimDimprepDescripcion;

    //proyecto
    /*this.dimProyName = this.proyectos.find(
      (p) => p.dimPrId == this.globalService.solDimensiones.dimProyecto
    ).dimPrCodigo + ' - ' + this.proyectos.find(
      (p) => p.dimPrId == this.globalService.solDimensiones.dimProyecto
    ).dimPrDescripcion;*/

    //sector
    /*this.dimSectName = this.sectores.find(
      (s) => s.dimSectId == this.globalService.solDimensiones.dimSect
    ).dimSectCodigo + ' - ' + this.sectores.find(
      (s) => s.dimSectId == this.globalService.solDimensiones.dimSect
    ).dimSectDescripcion;*/

    // actividad
    /*const actividad = this.actividades.find((a) => a.dimActId == this.globalService.solDimensiones.dimAct);
    this.dimActName = actividad ? `${actividad.dimActCodigo} - ${actividad.dimActDescripcion}` : '';*/

    // subactividad
    const subactividad = this.subactividades.find((sa) => sa.dimSubactId == this.globalService.solDimensiones.dimSubAct);
    this.dimSubActName = subactividad ? `${subactividad.dimSubactCodigo} - ${subactividad.dimSubactDescripcion}` : '';

    /*if (this.globalService.solIfProyecto == 1) {
      this.checkProyecto = true;
    }

    setTimeout(() => {
      const Event = { checked: this.checkProyecto };

      if (Event.checked) {
        this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 1);
        this.solIfProyecto = 1;
      } else {
        this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 0);
        this.solIfProyecto = 0;
      }
    }, 200);*/
  }

  solIfProyecto: number = 0;
  /*filterPresupuestos(Event: any) {
    this.dimPrespName = "";
    //si el check es true se filtra la lista cuando el campo dimDimprepProyecto sea = 1, si es false se filtra cuando sea = 0
    if (Event.checked) {
      this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 1);
      this.solIfProyecto = 1;
    } else {
      this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 0);
      this.solIfProyecto = 0;
    }
  }*/

  /* getSectoresByProyecto() {
     this.dimSectName = '';
     this.dimActName = '';
 
     //buscar id del proyecto seleccionado en dimProyName
     const proyectoSelected = this.proyectos.find((pr) => (pr.dimPrCodigo + ' - ' + pr.dimPrDescripcion) == this.dimProyName).dimPrId;
     this.projectSelected = proyectoSelected;
     //console.log("Proyecto seleccionado:", proyectoSelected);
 
     this.dimService.getSectorPSA(proyectoSelected).subscribe(
       (data) => {
         this.sectores = data;
         this.sectoresfiltered = data;
       }
     );
   }*/

  /*getActividadesBySector() {
    this.dimActName = '';

    //buscar id del sector seleccionado en dimSectName
    const sectorSelected = this.sectores.find((s) => (s.dimSectCodigo + ' - ' + s.dimSectDescripcion) == this.dimSectName).dimSectId;
    //console.log("Sector seleccionado:", sectorSelected);

    this.dimService.getActividadesPSA(this.projectSelected, sectorSelected).subscribe(
      (data) => {
        this.actividades = data;
        this.actividadesfiltered = data;
      }
    )
  }*/

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  saveDimensions() {
    //validar que todas las dimensiones esten seleccionadas
    if (!this.dimPrespName) {
      this.callMensaje("Por favor seleccione una dimensión presupuestaria.", false);
      console.error("Por favor seleccione una dimensión presupuestaria.");
      return;
    }

    // Buscar el ID de las dimensiones basadas en las selecciones exactas
    const presupuestoSelected = this.presupuestos.find(
      (p) => (p.dimDimprepCodigo + ' - ' + p.dimDimprepDescripcion) === this.dimPrespName
    );

    /*const sectSelected = this.sectores.find(
      (s) => (s.dimSectCodigo + ' - ' + s.dimSectDescripcion).trim() === this.dimSectName.trim()
    );*/

    /*const proyectoSelected = this.proyectos.find(
      (p) => (p.dimPrCodigo + ' - ' + p.dimPrDescripcion).trim() === this.dimProyName.trim()
    );*/

    var subActSelected: any = {}
    var actSelected: any = {}
    var isSubActSelected = false;

    //si se selecciona una subactividad y una actividad, se buscan las dimensiones en las listas
    if (this.dimSubActName != '') {
      isSubActSelected = true;
      subActSelected = this.subactividades.find(
        (sa) => (sa.dimSubactCodigo + ' - ' + sa.dimSubactDescripcion).trim() === this.dimSubActName.trim()
      );
      /*actSelected = this.actividades.find(
        (a) => (a.dimActCodigo + ' - ' + a.dimActDescripcion).trim() === this.dimActName.trim()
      );*/
    }

    //si subactividad y actividad no estan seleccionadas, se asigna el valor 158 y 92 respectivamente por defecto
    var suabActValue = 158;
    //var actValue = 92;

    //si se selecciona una subactividad y una actividad, se asignan los valores seleccionados
    if (isSubActSelected) {
      suabActValue = subActSelected.dimSubactId;
      //actValue = actSelected.dimActId;
    }

    if (presupuestoSelected) {
      const data = {
        dimPresupuesto: presupuestoSelected.dimDimprepId,
        dimSubAct: suabActValue,
        /*dimAct: actValue,
        dimSect: sectSelected.dimSectId,
        dimProyecto: proyectoSelected.dimPrId*/
      };

      //enviar datos al global service para que se almacenen
      this.globalService.solDimensiones = data;
      //this.globalService.solIfProyecto = this.solIfProyecto;
      this.globalService.isDimSetted = true;
      this.closeDialog();

    } else {
      console.error("No se encontraron todas las dimensiones seleccionadas.");
    }
  }


  closeDialog() {
    this.dialogRef.close();
    //console.log("globalservice.solDimensiones:", this.globalService.solDimensiones);
  }

  //filtrar proyectos del autocomplete
  /*filterProyectosList(event: any) {
    this.proyectosfiltered = this.proyectos.filter((proyecto) => {
      return proyecto.dimPrDescripcion.toLowerCase().includes(event.toLowerCase());
    });
  }

  //filtrar sectores del autocomplete
  filterSectoresList(event: any) {
    this.sectoresfiltered = this.sectores.filter((sector) => {
      return sector.dimSectDescripcion.toLowerCase().includes(event.toLowerCase());
    });
  }

  //filtrar actividades del autocomplete
  filterActividadesList(event: any) {
    this.actividadesfiltered = this.actividades.filter((actividad) => {
      return actividad.dimActDescripcion.toLowerCase().includes(event.toLowerCase());
    });
  }*/

  //filtrar subactividades del autocomplete
  filterSubActividadesList(event: any) {
    this.subactividadesfiltered = this.subactividades.filter((subactividad) => {
      return (subactividad.dimSubactCodigo + ' - ' + subactividad.dimSubactDescripcion).toLowerCase().includes(event.toLowerCase());
    });
  }

  //filtrar presupuestos del autocomplete
  filterPresupuestosList(event: any) {
    console.log("Evento:",event)
    console.log("DimPrespName:",this.dimPrespName)  

    if(this.dimPrespName == ''){
      this.prespFiltered = this.presupuestos.filter((presupuesto) => presupuesto.dimDimprepIfProyecto == 1);
      return;
    }
    console.log(this.presupuestos)
    this.prespFiltered = this.presupuestos.filter((presupuesto) => {
      return (presupuesto.dimDimprepCodigo + ' - ' + presupuesto.dimDimprepDescripcion).toLowerCase().includes(event.toLowerCase());
    });
  }
}
