import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from 'src/app/services/comunicationAPI/seguridad/departamentos.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { NivGerenciaService } from 'src/app/services/comunicationAPI/solicitudes/niv-gerencia.service';


@Component({
  selector: 'app-empleado-nivel',
  templateUrl: './empleado-nivel.component.html',
  styleUrls: ['./empleado-nivel.component.css']
})
export class EmpleadoNivelComponent implements OnInit {

  departamento: string = '';
  nivel: string = '';
  empleado: string = '';
  empleadoImp: string = '';

  changeview: string = 'consultar';
  buscarOpcion: string = 'dep';
  terminoBusqueda: string = '';

  empNivList: any[] = [];
  empNivList2: any[] = [];
  depList: any[] = [];
  nivelList: any[] = [];
  empList: any[] = [];
  empleados: any[] = [];

  constructor(private empleadoNivelService: NivGerenciaService,
    private departamentoService: DepartamentosService,
    private nivelRuteoService: NivelRuteoService,
    private empleadoService: EmpleadosService) { }

  ngOnInit(): void {
    setTimeout(() => {
      //extrae la lista de empleados asignados
      this.empleadoNivelService.getNivGerencias().subscribe(
        (data: any) => {
          this.empNivList = data;
          this.empNivList.sort((a, b) => a.empNivRuteo - b.empNivRuteo);
          this.empNivList2 = this.empNivList;
        },
        (error) => {
          console.log(error);
        }
      );

      //extrae la lista de departamentos
      this.departamentoService.getDepartamentos().subscribe(
        (data: any) => {
          this.depList = data;

        },
        (error) => {
          console.log(error);
        }
      );

      //extrae la lista de niveles de ruteo
      this.nivelRuteoService.getNivelruteo().subscribe(
        (data: any) => {
          this.nivelList = data;
        },
        (error) => {
          console.log(error);
        }
      );

      //extrae la lista de empleados
      this.empleadoService.getEmpleadosList().subscribe(
        (data: any) => {
          this.empList = data;
        },
        (error) => {
          console.log(error);
        }
      );

    }, 100);
    
    setTimeout(() => {
      this.filterList();
      
    }, 400);
  }


  filterList() {
    //modificar los valores de los campos de la lista empNivList para sustituir los id por los nombres
    this.empNivList.forEach((item) => {
      //buscar el nombre del departamento
      this.depList.forEach((item2) => {
        if (item.empNivDeptAutorizado == item2.depIdNomina) {
          item.empNivDeptAutorizado = item2.depDescp;
        }
      });
      

      //buscar el nombre del nivel de ruteo
      this.nivelList.forEach((item3) => {
        if (item.empNivRuteo == item3.nivel) {
          item.empNivRuteo = item3.descRuteo;
        }
      });

      //buscar el nombre del empleado
      this.empList.forEach((item4) => {
        if (item.empNivEmpelado == item4.empleadoIdNomina) {
          item.empNivEmpelado = item4.empleadoNombres + ' ' + item4.empleadoApellidos;
        }
      });
    });
    
  }

  currentPage: number = 1;
  //incrementa el valor d la variable que controla la pagina actual que se muestra
  nextPage(): void {
    //console.log("nextPage",this.currentPage);
    if (this.empNivList.length <= 10) {
      //console.log("nextPage",this.currentPage);
      this.currentPage = 1;
    } else if (this.currentPage >= this.empNivList.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++
    }

  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  changeView(view: string) {
    this.changeview = view;
  }

  search() {
    let valor = this.terminoBusqueda;
    if(valor == ''){
      this.empNivList = this.empNivList2;
    } else {
      if (this.buscarOpcion == 'dep') {
        //filtrar la lista empNivList cuando el campo empNivDeptAutorizado contenga lo que exista en terminoBusqueda
        const regex = new RegExp(valor, 'i'); // 'i' indica que la búsqueda sea insensible a mayúsculas/minúsculas
        this.empNivList = this.empNivList.filter(item => regex.test(item.empNivDeptAutorizado));
  
      } else if (this.buscarOpcion == 'name') {
        //filtrar la lista empNivList cuando el campo empNivEmpelado contenga lo que exista en terminoBusqueda
        const regex = new RegExp(valor, 'i'); // 'i' indica que la búsqueda sea insensible a mayúsculas/minúsculas
        this.empNivList = this.empNivList.filter(item => regex.test(item.empNivEmpelado));
  
      } else if (this.buscarOpcion == 'nivel') {
        //filtrar la lista empNivList cuando el campo empNivRuteo contenga lo que exista en terminoBusqueda
        const regex = new RegExp(valor, 'i'); // 'i' indica que la búsqueda sea insensible a mayúsculas/minúsculas
        this.empNivList = this.empNivList.filter(item => regex.test(item.empNivRuteo));
      }
    }
  }

  clearSearch() {
    this.terminoBusqueda = '';
    this.empNivList = this.empNivList2;
  }

  //guarda los datos de los empleados en una lista local dependiendo del tamaño de la variable de busqueda, esto se controla con un keyup
  searchEmpleado(): void {
    if (this.empBusqueda.length > 2) {
      this.empleadoService.getEmpleadosList().subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }

  empBusqueda: string = '';
  private inputTimer: any;
  onInputChanged(): void {
    // Cancelamos el temporizador anterior antes de crear uno nuevo
    clearTimeout(this.inputTimer);

    // Creamos un nuevo temporizador que ejecutará el método después de 1 segundo
    this.inputTimer = setTimeout(() => {
      // Coloca aquí la lógica que deseas ejecutar después de que el usuario haya terminado de modificar el input
      if (this.empBusqueda) {
        const empleadoSeleccionado = this.empleados.find(emp => (emp.empleadoNombres + ' ' + emp.empleadoApellidos) === this.empBusqueda);
        this.empleado = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdNomina : 'XXXXXX';
        //console.log("Inspector ID", this.cab_inspector);
      } else {
        this.empleado = '';
      }
    }, 800); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  enviar(){
    const data ={
      empNivDeptAutorizado: parseInt(this.departamento),
      empNivRuteo: parseInt(this.nivel),
      empNivEmpelado: this.empleado,
      empNivImp: this.empleadoImp
    }

    this.empleadoNivelService.addNivGerencia(data).subscribe(
      (data: any) => {
        //console.log("Exito: ",data);
        alert("Nivel asignado exitosamente.");
        setTimeout(() => {
          this.ngOnInit();
          this.clear();
        }, 1000);
      },
      (error) => {
        console.log(error);
        alert("Error, no se ha podido asignar el nivel.");
      }
    );
  }

  guardaredidion(){

    //volver a guardar los datos en las variables originales
    this.depList.forEach((item) => {
      if (item.depDescp == this.departamento) {
        this.departamento = item.depIdNomina;
      }
    });

    this.nivelList.forEach((item) => {
      if (item.descRuteo == this.nivel) {
        this.nivel = item.nivel;
      }
    });

    this.empList.forEach((item) => {
      if (item.empleadoNombres + ' ' + item.empleadoApellidos == this.empBusqueda) {
        this.empleado = item.empleadoIdNomina;
      }
    });


    setTimeout(() => {
      const data ={
        empNivId: this.idAsignado,
        empNivDeptAutorizado: parseInt(this.departamento),
        empNivRuteo: parseInt(this.nivel),
        empNivEmpelado: this.empleado,
        empNivImp: this.empleadoImp
      }
  
      this.empleadoNivelService.updateNivGerencia(data, this.idAsignado).subscribe(
        (data: any) => {
          //console.log("Exito: ",data);
          alert("Nivel editado exitosamente.");
          setTimeout(() => {
            this.ngOnInit();
            this.clear();
          }, 1000);
        },
        (error) => {
          console.log(error);
          alert("Error, no se ha podido editar el nivel.");
        }
      );
    }, 300);
  }

  idAsignado: number = 0;//guarda el id del elemento a eliminaro editar

  setElemento(elemento: any){
    this.idAsignado = elemento.empNivId;
    this.departamento = elemento.empNivDeptAutorizado;
    this.nivel = elemento.empNivRuteo;
    this.empBusqueda = elemento.empNivEmpelado;
    this.empleadoImp = elemento.empNivImp;
    this.changeView('editar');
  }

  eliminar(){
    this.empleadoNivelService.deleteNivGerencia(this.idAsignado).subscribe(
      (data: any) => {
        //console.log("Exito: ",data);
        alert("Nivel eliminado exitosamente.");
        setTimeout(() => {
          this.ngOnInit();
          this.changeView('consultar');
        }, 1000);
      },
      (error) => {
        console.log(error);
        alert("Error, no se ha podido eliminar el nivel.");
      }
    );
  }

  clear(){
    this.departamento = '';
    this.nivel = '';
    this.empleado = '';
    this.empBusqueda = '';
    this.empleadoImp = '';
    this.changeView('consultar');
  }
}
