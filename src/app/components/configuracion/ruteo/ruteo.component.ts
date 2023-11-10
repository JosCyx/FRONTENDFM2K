import { Component, OnInit } from '@angular/core';
import { Observable, map  } from 'rxjs';
import { Niveles } from 'src/app/models/Niveles';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { RuteoAreaService } from 'src/app/services/comunicationAPI/seguridad/ruteo-area.service';
import { DepartamentosService } from 'src/app/services/comunicationAPI/seguridad/departamentos.service';

@Component({
  selector: 'app-ruteo',
  templateUrl: './ruteo.component.html',
  styleUrls: ['./ruteo.component.css']
})
export class RuteoComponent implements OnInit {
  //variables que almacenan los datos de los niveles asignados
  rutArea: number = 0;
  rutDpto: number = 0;
  rutTipoSol: number = 0;

  nvNivel: string = '';
  nvDescp: string = '';
  nvEstado: string = '';

  dltArea: number = 0;
  dltTipoSol: number = 0;
  dltNivel: number = 0;

  nivGuardados: any[] = [];

  //lista que guarda los datos de la lista observable que trae desde la API los ruteos por ahora
  ruteoList: any[] = [];

  //lista temporal que guarda los datos del observable para extraer ciertas propiedades y guardarlas en otra lista
  nvtempList: any[] = [];
  //lista que guarda el nivel creado y le asigna estado=false por defecto, esta lista se usa para agregar los ruteos a la base de datos
  nivelesList: Niveles[] = [];

  //listas observables
  areaList$!: Observable<any[]>;
  TipoSol$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;


  //variables para controlar la funcionalidad de la pagina
  changeview: string = 'consultar';
  mensajeExito: string = '';
  mensajeError: string = '';
  busqArea: number = 0;
  nivGuardar: number = 0;
  nvRepetido: boolean = false;
  showmsjNivel: boolean = false;
  checkBusq: boolean = false;
  checkNivel: boolean = false;
  getNivelEstado: string = 'A';//variable que controla el estado de los niveles a obtener, 'A' retorna solo estados acivos, 'I' retorna estados inactivos

  departamentos: any[] = [];


  constructor(
    private areaService: AreasService,
    private tipSolService: TipoSolService,
    private nivRuteoService: NivelRuteoService,
    private rutAreaService: RuteoAreaService,
    private departService: DepartamentosService) { }


  ngOnInit() {
    this.nivelRut$ = this.nivRuteoService.getNivelbyEstado(this.getNivelEstado).pipe(
      map(niv => niv.sort((a, b) => a.nivel - b.nivel))
    );   

    this.nivelRut$.subscribe((data) => {
      this.nvtempList = [];
      this.nvtempList = data;
      this.nivelesList = [];
      for (let i of this.nvtempList) {
        const nivel = {
          nivel: i.nivel,
          status: i.estadoRuteo,
          estado: false
        }
        this.nivelesList.push(nivel);
      }
    });

    setTimeout(() => {
      
      this.areaList$ = this.areaService.getAreaList();
      this.TipoSol$ = this.tipSolService.getTipoSolicitud();
  
      this.departService.getDepartamentos().subscribe(
        (data: any) => {
          this.departamentos = data;
        },
        error => {
          console.log("Error al obtener los departamentos: ", error);
        }
      );
      
    }, 300);
    

  }
  nivelByDep: any[] = []; 

  changeView(view: string): void {
    this.clear();
    if (view == 'eliminar') {
      this.dltArea = this.busqArea;
      this.changeview = view;
    } else if(view == 'editar'){
      this.disableDept = true;
      this.disableSol = true;
      this.changeview = view;
    }
    this.changeview = view;
    
  }

  setNivelestoDlt(){
    this.nivelByDep = [];
    //consultar los niveles segun el departamento
    this.rutAreaService.getRuteoByDepSol(this.dltArea, this.dltTipoSol).subscribe(
      (data: any) => {
        this.nivelByDep = data;
        //console.log("Niveles por departamento: ", this.nivelByDep);
      },
      error => {
        console.log("Error al obtener los niveles por departamento: ", error);
      }
    );
  }

  cancelar(): void {
    this.clear();
    this.changeview = 'consultar';
  }

  clear(): void {
    this.rutArea = 0;
    this.rutTipoSol = 0;
    this.nivGuardados = [];
    this.ruteoList = [];
    this.checkBusq = false;
    this.showmsjNivel = false;
    this.dltArea = 0
    this.dltNivel = 0
    this.dltTipoSol = 0
    this.nvDescp = '';
    this.rutDpto = 0;
    this.nvNivel = '';
    this.nvEstado = '';
    for (let nivel of this.nivelesList) {
      nivel.estado = false;
    }

  }


  changeEstado(nivel: Niveles) {
    nivel.estado = !nivel.estado; // Cambia el estado del checkbox (true a false o false a true)
  }

  //agrega un ruteo a la tabla, si el ruteo ya existe muestra un mensaje
  guardarRuteo() {
    //console.log("inicio de guardado");

    for (let nivel of this.nivelesList) {
      if (nivel.estado === true) {

        this.rutAreaService.checkRuteoExistence(this.rutTipoSol, this.rutDpto, nivel.nivel).subscribe(
          (data: any) => {
            if (data) {
              // Si el ruteo ya existe se guardan los valores de los niveles en una lista para mostrarlos en un mensaje
              //console.log(`El ruteo para el nivel ${nivel.nivel} ya existe.`);

              this.nivGuardar = nivel.nivel;

              this.nivGuardados.push(this.nivGuardar);

              this.showmsjNivel = true;

              setTimeout(() => {
                this.showmsjNivel = false;
                this.nivGuardados = [];
                //this.clear();          
              }, 2000);

            } else {
              // Si el ruteo no existe se crea el arreglo y se envia a la API
              const data = {
                rutareaTipoSol: this.rutTipoSol,
                rutareaArea: this.rutArea,
                rutareaDpto: this.rutDpto,
                rutareaNivel: nivel.nivel
              };


              this.rutAreaService.addRuteos(data).subscribe(
                () => {
                  //console.log('Ruteo agregado exitosamente');
                  this.mensajeExito = 'Niveles asignados exitosamente.';
                  setTimeout(() => {
                    this.mensajeExito = '';
                    this.clear();
                    this.changeview = 'consultar';
                  }, 3000);
                },
                error => {
                  this.mensajeError = 'Error intente de nuevo.';
                  console.log('Error:', error);
                }
              );
            }
          },
          error => {
            // Manejo de errores en la petición para verificar la existencia del ruteo
            this.mensajeError = 'Error al verificar la existencia del ruteo.';
            console.log('Error al verificar la existencia del ruteo:', error);
          }
        );

      }
    }
  }

  departamentosFilter: any[] = [];
  disableDept: boolean = true;
  disableSol: boolean = true;
  searchDeptByArea(){
    this.disableDept = false;
    this.departamentosFilter = this.departamentos.filter((dept) => dept.depArea == this.rutArea);
  }

  activeSol(){
    this.disableSol = false;
  }

  consultarRuteo() {
    this.ruteoList = [];
    this.mensajeError = '';

    this.rutAreaService.getRuteosByArea(this.busqArea).subscribe(
      response => {
        this.ruteoList = response;
        this.checkBusq = true;
        //console.log("Exito: ",this.ruteoList);
      },
      error => {
        if (error.status == 404) {
          this.mensajeError = 'No se ha encontrado niveles asignados para ese departamento.';
        } else {
          this.mensajeError = 'Error, no se ha podido consultar los niveles.';

        }
        console.log("Error: ", this.ruteoList);
        console.log("Error al consultar el ruteo: ", error);
      }
    );

  }

  //crea un arreglo con los valores necesarios y lo envía a la API para crear un nuevo nivel
  agregarNivel(): void {

    //recorre la lista de niveles y verifica si el valor del nivel ingresado ya existe en la lista
    for (let niv of this.nivelesList) {
      if (niv.nivel === parseInt(this.nvNivel, 10)) {
        this.nvRepetido = true;
        break;
      }
    }

    //evalua si el nivel ya existe y muestra una respuesta
    if (this.nvRepetido) {
      //console.log("condicion, nivel repetido: ", parseInt(this.nvNivel));
      this.mensajeError = 'El nivel ya existe, ingrese otro valor.';
      setTimeout(() => {
        this.mensajeError = '';
        this.nvNivel = '';
        this.nvRepetido = false;
      }, 3000);

    } else {
      //console.log("else, nivel nuevo: ", parseInt(this.nvNivel, 10));

      const data = {
        nivel: this.nvNivel,
        descRuteo: this.nvDescp,
        estadoRuteo: this.nvEstado
      }

      this.nivRuteoService.addnivelRuteo(data).subscribe(
        response => {
          //console.log("Nivel añadido correctamente.");
          this.mensajeExito = 'Nivel registrado exitosamente.';
          setTimeout(() => {
            this.mensajeExito = '';
            this.clear();
            this.ngOnInit();
            this.changeview = 'consultar';

          }, 3000);
        },
        error => {
          this.mensajeError = 'Error intente de nuevo.';
          setTimeout(() => {
            this.mensajeError = '';
            this.clear();
          }, 3000);
          console.log("Error al añadir el nivel: ", error);
        }
      );
    }

  }

  borrarRuteo(): void {
    this.rutAreaService.deleteRuteo(this.dltTipoSol, this.dltArea, this.dltNivel).subscribe(
      response => {
        this.mensajeExito = 'Se ha eliminado el nivel seleccionado.';
        setTimeout(() => {
          this.mensajeExito = '';
          this.changeview = 'consultar';
        }, 3000);
      },
      error => {

        if (error.status == 404) {
          this.mensajeError = 'Error, el nivel seleccionado no existe.';
        } else {
          this.mensajeError = 'Error, no se ha podido eliminar el nivel, intente nuevamente.';
        }

        console.log("Error: ", error)
        setTimeout(() => {
          this.mensajeError = '';
        }, 3000);
      }
    );
    
  }
}

