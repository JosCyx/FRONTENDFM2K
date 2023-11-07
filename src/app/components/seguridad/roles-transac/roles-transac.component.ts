import { Component, OnInit } from '@angular/core';
import { RolTransaccionesService } from 'src/app/services/comunicationAPI/seguridad/rol-transacciones.service';
import { RolesService } from 'src/app/services/comunicationAPI/seguridad/roles.service';
import { TransaccionesService } from 'src/app/services/comunicationAPI/seguridad/transacciones.service';
interface Transac {
  trCodigo: number;
  trNombre: string;
  trCheck: boolean;
}
interface RolTransac {
  rtEmpresa: number;
  rtRol: number;
  rtTransaccion: number;
  rtEstado: string;
}
@Component({
  selector: 'app-roles-transac',
  templateUrl: './roles-transac.component.html',
  styleUrls: ['./roles-transac.component.css'],
})
export class RolesTransacComponent implements OnInit {
  transacList: Transac[] = [];
  rolTransacList: RolTransac[] = [];
  rolConsuList: any[] = [];

  rolList!: any[];
  rolAsign: number = 0;
  rolAsignConsu: number = 0;

  changeview: string = 'consulta';
  currentPage: number = 1;
  idAuthDele: number = 0;
  //mensajes
  showmsj: boolean = false;
  msjExito: string = '';
  msjError: string = '';
  showmsjerror: boolean = false;

  isMensaje: boolean = true;

  constructor(
    private transacService: TransaccionesService,
    private rolService: RolesService,
    private rolTservice: RolTransaccionesService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {

      this.rolService.getRolsList().subscribe(
        (response) => {
          this.rolList = response;
        },
        (error) => {
          console.log(error);
        }
      );
      
      this.transacService.getTransaccionesList().subscribe(
        (response) => {
          this.transacList = response.map((item: any) => {
            return {
              trCodigo: item.trCodigo,
              trNombre: item.trNombre,
              trCheck: false,
            };
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }, 400);

    
  }
  //incrementa el valor d la variable que controla la pagina actual que se muestra
  nextPage(): void {
    console.log('nextPage', this.currentPage);
    if (this.transacList.length <= 10) {
      console.log('nextPage', this.currentPage);
      this.currentPage = 1;
    } else if (this.currentPage >= this.transacList.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++;
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
    this.clear();
  }
  //metodo para enviar
  seleccionarTrans() {
    //for de this.transacList y solo cuando sea un true  genero un elememto de la lista de roltransac
    this.transacList.forEach((element) => {
      if (element.trCheck) {
        let rolTransac: RolTransac = {
          rtEmpresa: 1,
          rtRol: this.rolAsign,
          rtTransaccion: element.trCodigo,
          rtEstado: 'A',
        };
        this.rolTransacList.push(rolTransac);
      }
    });
    console.log('rolTransacList', this.rolTransacList);
  }
  //enviar
  guardarAutorizacion() {
    this.rolTransacList.forEach((element) => {
      this.rolTservice.addTransaccionRol(element).subscribe({
        next: (response) => {
          console.log('response', response);
          this.showmsj = true;
          this.msjExito = 'Se guardo correctamente';
          this.rolTransacList = [];//vaciar la lista de roltransac
          setTimeout(() => {
            this.clear();
            this.changeview = 'consulta';
            this.ngOnInit();
          }, 1000);
        },
        error: (error) => {
          console.log(error);
          this.showmsjerror = true;
          this.msjError = `${error.error}` ;
          setTimeout(() => {
            this.showmsjerror = false;
            this.msjError = '';
            this.changeview = 'consulta';
          }, 2000);
        },
      });
    });
  }


  async Buscar() {

    this.rolConsuList = [];
    this.isMensaje = false;
    // Filtra rolConsuList para mostrar solo los datos del rol seleccionado
    this.rolTservice.getTransaccionesbyRol(this.rolAsignConsu).subscribe({
      next: (response) => {
        this.rolConsuList = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
  selectIdDelete(id: number) {
    this.idAuthDele = id;
  }
  eliminarAutorizacion() {
    this.rolTservice.deleteTransaccionRol(this.idAuthDele).subscribe({
      next: (response) => {
        this.showmsj = true;
          this.msjExito = 'Se Elimino correctamente';
          setTimeout(() => {
            this.clear();
            this.changeview = 'consulta';
            this.ngOnInit();
          }, 1000);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  cancelar(): void {
    this.changeview = 'consulta';
  }
  clear() {
    //variables de mensajes
    this.msjExito = '';
    this.showmsj = false;
    this.showmsjerror = false;
    this.msjError = '';
    // Variables de seleccion
    this.rolAsign = 0;
    this.rolAsignConsu = 0;
    //
    this.isMensaje = true;
    //
    this.transacList.forEach((element) => {
      element.trCheck = false;
    });
  }

  disableButton: boolean = true;
  ElementoSeleccionado(): boolean {
    return this.transacList.some((item) => item.trCheck === true);
  }

  setdisableButton(){
    this.disableButton = false;
  }
}
