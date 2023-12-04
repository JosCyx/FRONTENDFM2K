import { Component, Input, OnInit } from '@angular/core';
import { I, co } from '@fullcalendar/core/internal-common';
import { Observable, forkJoin, map } from 'rxjs';
import { DestinoPagoServiceService } from 'src/app/services/comunicationAPI/seguridad/destino-pago-service.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { GlobalService } from 'src/app/services/global.service';
import { SolipagoComponent } from '../solipago.component';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { set } from 'date-fns';

interface Detalle {
  idDetalle: number;
  descpDetalle: string;
  destinoDetalle: boolean;
}

interface ItemDestino {
  dtTipoSol: number;
  dtNoSol: number;
  dtIdItem: number;
  dtEmpleado: string;
  dtSector: number;
  dtObservaciones: string;
}

interface Evidencias {
  evIdDetalle: number;
  evNombre: string;
  evArchivo: File;
}

@Component({
  selector: 'app-sp-destino',
  templateUrl: './sp-destino.component.html',
  styleUrls: ['./sp-destino.component.css'],
})
export class SpDestinoComponent implements OnInit {
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  @Input() numericoSol!: string;
  @Input() estadoSol!: string;
  @Input() areaSol!: number;
  @Input() detalles!: Detalle[];

  archivo!: File;
  archivos: Evidencias[] = [];

  //Alerta
  alert: boolean = false;
  alertText: string = "";

  private inputTimer: any;
  empleados!: any[];
  sectores!: any[];
  empleadoBusq!: string;
  idItem: number = 0;
  itemDestino: ItemDestino[] = [];
  checkdestino: boolean = false;
  urlArchivo!: string;

  //variables para guardar los datos del destino
  sectorDestino: number = 9999;
  empleadoDestino!: string;
  observacionesDestino!: string;

  showExito: boolean = false;
  msjExito: string = '';
  showError: boolean = false;
  msjError: string = '';

  constructor(private sectoresService: SectoresService,
    private empleadoService: EmpleadosService,
    private uploadService: UploadFileService,
    private destinoService: DestinoPagoServiceService,
    private globalService: GlobalService,
    private cabPago: SolipagoComponent,
    private sectorServices: SectoresService,private dialogService:DialogServiceService) { }

  ngOnInit(): void {
    console.log(this.tipoSol, this.noSol)
    setTimeout(() => {

      this.empleadoService.getEmpleadosList().subscribe(
        (data: any[]) => {
          this.empleadosEv = data;
        },
        (error) => {
          console.log(error);
        }
      );

      this.sectoresService.getSectoresList().subscribe(
        (data: any[]) => {
          this.sectorEv = data;
        },
        (error) => {
          console.log(error);
        }
      );

      this.empleadoService.getEmpleadobyArea(this.areaSol).subscribe(
        (data: any[]) => {
          this.empleados = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }, 100);

    setTimeout(() => {
      this.viewFile();
    }, 500);
  }

  empleadosEv: any[] = [];
  sectorEv: any[] = [];
  //Mensajes de Dialogo
  callMensaje(mensaje: string, type: boolean){
    this.dialogService.openAlertDialog(mensaje, type);
  }
  //busca los empleados segun su area
  searchEmpleado(): void {
    this.searchSectores();
    if (this.empleadoBusq.length > 2) {
      this.empleadoService
        .getEmpleadosList()
        .subscribe((data: any[]) => {
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
        const empleadoSeleccionado = this.empleados.find(
          (emp) =>
            emp.empleadoNombres + ' ' + emp.empleadoApellidos ===
            this.empleadoBusq
        );
        this.empleadoDestino = empleadoSeleccionado
          ? empleadoSeleccionado.empleadoIdNomina
          : 'No se ha encontrado el inspector';
      } else {
        this.empleadoDestino = 'XXXXXX';
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  searchSectores() {
    this.sectoresService.getSectoresList().subscribe(
      (data: any[]) => {
        this.sectores = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //guarda el id del item seleccionado para registrar su destino (se ejecuta en el click al tr)
  saveIdItem(item: any) {
    this.idItem = item.idDetalle;
  }

  //guarda los datos del destino segun su item (se ejecuta en el boton confirmar del modal)
  setItemDestino() {
    const itemDestino = {
      dtTipoSol: this.tipoSol,
      dtNoSol: this.noSol,
      dtIdItem: this.idItem,
      dtEmpleado: this.empleadoDestino,
      dtSector: this.sectorDestino,
      dtObservaciones: this.observacionesDestino,
    };
    this.itemDestino.push(itemDestino);

    //cambiar de estado el campo de asignado
    this.detalles.forEach((det) => {
      if (det.idDetalle === this.idItem) {
        det.destinoDetalle = true;
      }
    });

    //limpiar las variables
    this.sectorDestino = 9999;
    this.empleadoDestino = 'XXXXXX';
    this.observacionesDestino = '';
    this.empleadoBusq = '';
    this.idItem = 0;
    this.archivo = null as any;
    this.checkDestinos();
    this.resetInputFile();
  }

  resetInputFile() {
    const inputElement = document.getElementById(
      'archivoInput'
    ) as HTMLInputElement;

    if (inputElement) {
      // Resetea el valor del input
      inputElement.value = '';
    } else {
      console.error("El elemento con ID 'archivoInput' no existe en el DOM.");
    }
  }

  //verifica que todos los items tengan un destino asignado
  checkDestinos() {
    this.checkdestino = this.detalles.every(
      (det) => det.destinoDetalle === true
    );
  }

  cancelarDestino() {
    //limpiar las variables usadas en el modal del destino y la variable idItem
    this.deleteArchivoModal(this.idItem);
    this.sectorDestino = 9999;
    this.empleadoDestino = 'XXXXXX';
    this.observacionesDestino = '';
    this.empleadoBusq = '';
    this.archivo = null as any;
    this.resetInputFile();
    this.idItem = 0;
    if (this.detalles != undefined) {
      this.detalles.forEach((det) => {
        det.destinoDetalle = false;
      });
    }
    this.evidenciasConsultadas = [];
  }

 deleteFilesUnsaved() {
    //eliminar de la base los archivos que se hayan creado pero no se hayan guardado
    this.destinoService.deleteEvidencia(this.tipoSol, this.noSol).subscribe(
      res => {
        console.log("Se han eliminado correctamente las evidencias de la base: ", res);
        //eliminar del servidor la carpeta que se haya creado pero no se haya guardado

        this.uploadService.deleteFolder(this.numericoSol).subscribe(
          res => {
            console.log("Se ha eliminado la carpeta creada de esta solicitud: ", res);
          },
          error => {
            console.log("Error: ", error);
          }
        );
      },
      error => {
        console.log("Error: ", error);
      }
    );


  }

  deleteArchivoModal(idDlt: number) {
    for (let i = 0; i < this.archivos.length; i++) {
      if (this.archivos[i].evIdDetalle === idDlt) {
        //console.log('Archivo a eliminar:', this.archivos[i]);
        this.archivos.splice(i, 1);

      }
    }
  }

  deleteArchivo(index: number) {
    //console.log(this.archivos);
    this.archivos.splice(index, 1);
  }

  //SUBIR LOS ARCHIVOS AL SERVIDOR

  //guarda el archivo en la lista de archivos y resetea el input para agregar nuevos archivos
  getFiles(event: any): void {
    this.archivo = event.target.files[0];
    //console.log('tamañlan sd', this.archivo);
    //200KB
    if (this.archivo.type !== 'image/jpeg' && this.archivo.type !== 'image/jpg') {
      this.alert = true;
      this.alertText = " ‎  El archivo debe ser de tipo JPEG o JPG";
      setTimeout(() => {
        this.alert = false;
        this.alertText = "";
        this.resetInputFile();
      }, 2000);
    } else if (this.archivo.size > 500000) {
      this.alert = true;
      this.alertText = " ‎ El Tamaño del archivo no debe superar los 500kB";
      setTimeout(() => {
        this.alert = false;
        this.alertText = "";
        this.resetInputFile();
      }, 2000);
    } else {
      const data = {
        evIdDetalle: this.idItem,
        evNombre: this.archivo.name,
        evArchivo: this.archivo,
      };
      this.archivos.push(data);

      //limpiar el input y la variable archivo
      this.archivo = null as any;
      this.resetInputFile();
    }
  }

  //envía los destinos a la API para ser guardados
  registrar() {
    // console.log(this.itemDestino);
    // console.log(this.archivos);
    this.itemDestino.forEach((item) => {
      this.archivos.forEach((arch) => {
        if (arch.evIdDetalle === item.dtIdItem) {
          //guardar el archivo en el servidor


          this.sendfile(arch.evArchivo, item.dtIdItem.toString()).subscribe(
            (url) => {
              this.urlArchivo = url;

              const data: any = {
                destPagTipoSol: item.dtTipoSol,
                destPagNoSol: item.dtNoSol,
                destPagIdDetalle: item.dtIdItem,
                destPagEmpleado: item.dtEmpleado,
                destPagSector: item.dtSector,
                destPagObervacion: item.dtObservaciones,
                destPagEvidencia: this.urlArchivo,
              };

              //console.log("Datos: ",data);

              this.destinoService.agregarEvidenciaPago(data).subscribe(
                res => {
                  const msjExito = 'Se ha agregado el destino correctamente.';
                  this.callMensaje(msjExito, true);
                },
                error => {
                  console.log("Error: ", error);
                  const msjError = 'No se ha podido agregar el destino, intente nuevamente.';
                  this.callMensaje(msjError, false);
                }
              );

              this.urlArchivo = '';
            }


          );



        }

      });
    });
    this.cabPago.setDestino = true;
    this.archivos = [];
  }




  //Enviar archivos al servidor
  sendfile(file: File, idItem: string): Observable<string> {
    const body = new FormData();
    body.append('archivos', file);

    // Utilizamos el operador map para transformar la respuesta en la URL
    return this.uploadService
      .uploadPagoDocs(body, this.numericoSol, idItem)
      .pipe(
        map((data) => {
          return data.url;
        })
      );
  }

  evidenciasConsultadas: any[] = [];
  //visualizar los archivos registrados
  viewFile() {
    this.destinoService.getEvidenciasBySolicitud(this.tipoSol, this.noSol).subscribe(
      (data: any[]) => {
        this.evidenciasConsultadas = data;
        this.setImages();
        console.log("Evidencias: ", this.evidenciasConsultadas);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setImages() {
    const observables = this.evidenciasConsultadas.map(ev => this.destinoService.getImage(ev.destPagEvidencia));

    forkJoin(observables).subscribe(
      (data: any[]) => {
        //console.log('Imágenes obtenidas:', data);
        data.forEach((blob, index) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            this.evidenciasConsultadas[index].image = base64data;
          };
          reader.readAsDataURL(blob);
        });
      },
      error => {
        console.log('Error al obtener las imágenes:', error);
      }
    );
  }


}
