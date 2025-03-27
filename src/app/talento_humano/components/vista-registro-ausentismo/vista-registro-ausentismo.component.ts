import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalAusService } from 'src/app/services/global-aus.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-vista-registro-ausentismo',
  templateUrl: './vista-registro-ausentismo.component.html',
  styleUrls: ['./vista-registro-ausentismo.component.css']
})
export class VistaRegistroAusentismoComponent {
  @ViewChild('fileInput') fileInput: any;

  motivoAusId!: number;
  motivoAusName: string = '';
  observacionAus: string = '';

  usuarioName: string = this.cookieService.get('userName');
  fechaString: string = this.globalService.formatDateToSpanish(new Date());

  loading: boolean = true;

  selectedStartDate!: Date | undefined;
  selectedStartHour!: number | undefined;
  selectedStartMinutes!: number | undefined;

  selectedEndDate!: Date | undefined;
  selectedEndHour!: number | undefined;
  selectedEndMinutes!: number | undefined;

  validStartHour: boolean = true;
  validStartMinutes: boolean = true;
  validEndHour: boolean = true;
  validEndMinutes: boolean = true;

  documentList: { name: string, img: string, file?: File, ruta?: string }[] = [];
  motivoList: any[] = [];
  motivoListFiltered: any[] = [];
  requiredDocument: boolean = false;
  creationMode: boolean = this.globalAusService.creationMode;

  estadoProcesoAus: number = 10;

  constructor(
    private cookieService: CookieService,
    private globalService: GlobalService,
    private dialogService: DialogServiceService,
    private ausentismoService: AusentismosService,
    private globalAusService: GlobalAusService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = false;

    setTimeout(() => {
      this.ausentismoService.getMotivosAus().subscribe(
        (res: any) => {
          this.motivoList = res;
          this.motivoListFiltered = res;
        },
        (error) => {
          console.log(error);
        }
      );
    }, 200);

    setTimeout(() => {

      if (!this.creationMode) {
        //buscar y cargar los datos del ausentismo seleccionado
        const ausId = this.globalAusService.idAusentismoSelected;
        console.log("ausId: ", ausId);

        this.ausentismoService.getAusentismoById(ausId).subscribe(
          (res: any) => {
            //console.log("ausentismo seleccionado: ", res);
            if (res) {
              this.motivoAusId = res.aus.ausMotivo;
              this.motivoAusName = this.motivoList.find(mot => mot.motId === res.aus.ausMotivo).motDescripcion;
              this.observacionAus = res.aus.ausObservacion;

              this.selectedStartDate = new Date(res.aus.ausDesde);
              this.selectedStartHour = this.selectedStartDate.getHours();
              this.selectedStartMinutes = this.selectedStartDate.getMinutes();

              this.selectedEndDate = new Date(res.aus.ausHasta);
              this.selectedEndHour = this.selectedEndDate.getHours();
              this.selectedEndMinutes = this.selectedEndDate.getMinutes();

              this.estadoProcesoAus = res.aus.ausEstadoProceso;

              // Cargar los documentos
              this.documentList = res.docs.map((doc: any) => ({
                name: doc.ausDocNombre,
                img: this.getFileIcon(doc.ausDocNombre), // Función para obtener un ícono según la extensión
                ruta: doc.ausDocRuta
              }));
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }, 350);
  }

  ngOnDestroy() {
    this.globalAusService.creationMode = true;
    this.globalAusService.idAusentismoSelected = 0;
    this.clearForm();
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) return 'assets/img/default.webp';

    if (['png', 'jpg', 'jpeg'].includes(extension)) return 'assets/img/image.webp';
    if (['pdf'].includes(extension)) return 'assets/img/pdf.webp';
    if (['xls', 'xlsx'].includes(extension)) return 'assets/img/excel.webp';
    if (['doc'].includes(extension)) return 'assets/img/doc.webp';
    if (['docx'].includes(extension)) return 'assets/img/docx.webp';

    return 'assets/img/default.webp';
  }


  getFinalDate(date: Date | undefined, hours: number | undefined, minutes: number | undefined): Date {
    if (!date || !hours || !minutes) {
      return new Date();
    }

    const finalDate = new Date(date);
    finalDate.setHours(hours, minutes, 0, 0); // Set horas, minutos y segundos

    return finalDate;
  }

  getLocalDate(date: Date): string {
    const offset = -5 * 60; // GMT-5 en minutos
    const localDate = new Date(date.getTime() + offset * 60000);
    return localDate.toISOString();
  }

  verifyValidHour(type: number) {

    if (this.selectedStartHour === undefined || this.selectedStartHour === null || this.selectedEndHour === null || this.selectedEndHour === undefined) {
      this.selectedStartHour = 0;
      this.selectedEndHour = 0;
    }

    if (type === 1) {
      if (this.selectedStartHour < 0 || this.selectedStartHour > 23) {
        this.validStartHour = false;
        return;
      } else {
        this.validStartHour = true;
        return;
      }
    } else {
      if (this.selectedEndHour < 0 || this.selectedEndHour > 23) {
        this.validEndHour = false;
        return;
      } else {
        this.validEndHour = true;
        return;
      }
    }
  }

  verifyValidMinutes(type: number) {

    if (this.selectedStartMinutes === undefined || this.selectedStartMinutes === null || this.selectedEndMinutes === null || this.selectedEndMinutes === undefined) {
      this.selectedStartMinutes = 0;
      this.selectedEndMinutes = 0;
    }

    if (type === 1) {
      if (this.selectedStartMinutes < 0 || this.selectedStartMinutes > 59) {
        this.validStartMinutes = false;
        return;
      } else {
        this.validStartMinutes = true
        return;
      }
    } else {
      if (this.selectedEndMinutes < 0 || this.selectedEndMinutes > 59) {
        this.validEndMinutes = false;
        return;
      } else {
        this.validEndMinutes = true;
        return;
      }
    }
  }

  callMessage(message: string, type: boolean) {
    this.dialogService.openAlertDialog(message, type);
  }

  onFileSelected(event: any): void {
    if (this.documentList.length >= 5) {
      this.callMessage('No se pueden agregar más de 5 archivos.', false);
      return;
    }

    const selectedFile = event.target.files[0];

    //verificar si el archivo ya existe en this.documentList
    const existingFile = this.documentList.find((item: any) => item.name === selectedFile.name);
    if (existingFile) {
      this.callMessage('El archivo ya existe en la lista.', false);
      return;
    }

    // Validar el tipo y tamaño del archivo
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword'];
      const maxSize = 5000 * 1024; // 5 MB

      if (!validTypes.includes(selectedFile.type)) {
        this.callMessage('El formato del archivo no está permitido.', false);
        return;
      }

      if (selectedFile.size > maxSize) {
        this.callMessage('El tamaño del archivo no debe exceder 5 MB.', false);
        return;
      }

      /*const reader = new FileReader();

      reader.onload = (e: any) => {
        this.documentList.push({ name: selectedFile.name, file: selectedFile});
        this.fileInput.nativeElement.value = '';
      };
      reader.readAsDataURL(selectedFile);*/

      let iconPath = '';

      if (selectedFile.type.includes('image')) {
        iconPath = 'assets/img/image.webp';
      } else if (selectedFile.type.includes('pdf')) {
        iconPath = 'assets/img/pdf.webp';
      } else if (selectedFile.type.includes('spreadsheet')) {
        iconPath = 'assets/img/excel.webp';
      } else if (selectedFile.type.includes('msword')) {
        iconPath = 'assets/img/doc.webp';
      } else if (selectedFile.type.includes('wordprocessingml')) {
        iconPath = 'assets/img/docx.webp';
      }

      // Agregar el archivo a la lista
      this.documentList.push({
        name: selectedFile.name,
        img: iconPath,
        file: selectedFile
      });

      // Limpiar el input
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteFile(doc: string) {
    const ruta = this.documentList.find((docItem) => docItem.name === doc)?.ruta;
    
    if(ruta){
      //si tiene una ruta, eliminarlo de la base de datos
      this.ausentismoService.deleteAusFile(doc).subscribe(
        (res: any) => {
          //console.log("Archivo eliminado: ", res);
          const index = this.documentList.findIndex((docItem) => docItem.name === doc);
          this.documentList.splice(index, 1);
        },
        (error) => {
          console.error("Error al eliminar el archivo:", error);
          this.callMessage('Error al eliminar el archivo.', false);
        }
      );
    } else {
      const index = this.documentList.findIndex((docItem) => docItem.name === doc);
      this.documentList.splice(index, 1);
    }
  }

  setMotivo(motivo: any) {
    if (motivo) {
      this.motivoAusId = motivo.motId;  // Guarda el ID
      this.motivoAusName = motivo.motDescripcion; // Muestra la descripción
    }
  }

  onMotivoSelected(event: any) {
    const selectedMotivo = this.motivoList.find(mot => mot.motDescripcion === event);
    if (selectedMotivo) {
      this.motivoAusId = selectedMotivo.motId;
    }
  }

  updateMotivosListFiltered(event: any) {
    this.filterMotivos(event.target.value);
  }

  filterMotivos(filterValue: string) {
    this.motivoListFiltered = this.motivoList.filter(mot =>
      (mot.motDescripcion).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  clearForm() {
    this.motivoAusId = 0;
    this.motivoAusName = '';
    this.observacionAus = '';
    this.selectedStartDate = undefined;
    this.selectedStartHour = undefined;
    this.selectedStartMinutes = undefined;
    this.selectedEndDate = undefined;
    this.selectedEndHour = undefined;
    this.selectedEndMinutes = undefined;
    this.validStartHour = true;
    this.validStartMinutes = true;
    this.validEndHour = true;
    this.validEndMinutes = true;
    this.documentList = [];

    this.router.navigate(['vista-listado-ausentismos']);
  }

  validarFormulario(): boolean {

    const StartDate = this.getFinalDate(this.selectedStartDate, this.selectedStartHour, this.selectedStartMinutes);
    const EndDate = this.getFinalDate(this.selectedEndDate, this.selectedEndHour, this.selectedEndMinutes);

    //validar que se haya seleccionado un motivo
    if (!this.motivoAusId || this.motivoAusId < 1) {
      this.callMessage('Debe seleccionar un motivo.', false);
      return false
    }

    //validar que se haya ingresado una observacion
    if (!this.observacionAus) {
      this.callMessage('Debe ingresar una observación.', false);
      return false;
    }

    //validar que la shoras ingresadas sean correctas
    if (!this.validStartHour || !this.validStartMinutes || !this.validEndHour || !this.validEndMinutes) {
      this.callMessage('Debe ingresar una hora y minutos válidos.', false);
      return false;
    }

    //vaidra que se hayan ingresado fechas
    if (!this.selectedStartDate || !this.selectedEndDate) {
      this.callMessage('Debe seleccionar una fecha de inicio y una fecha de fin.', false);
      return false;
    }

    //verificar que la fecha de inicio sea menor a la fecha de fin
    if (StartDate >= EndDate) {
      this.callMessage('La fecha de inicio debe ser menor a la fecha de fin.', false);
      return false;
    }

    //validar si el motivo requiere o no documentacion
    const motivo = this.motivoList.find(mot => mot.motId === this.motivoAusId);
    if (motivo.motIfDocument == 1) {
      this.requiredDocument = true;
      if (this.documentList.length === 0) {
        this.callMessage('Este motivo requiere adjuntar al menos un documento.', false);
        return false;
      }
    }

    return true;
  }

  triggerEnvio(send: boolean) {
    const accion = send ? 'enviar' : 'guardar';

    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea ${accion} esta justificación?`).subscribe(
      async (response) => {
        confirmDialogSubscription.unsubscribe();
        if (response) {

          const isValid = this.validarFormulario();
          const lvl = send ? 20 : 10;

          if (isValid) {
            const data = {
              ausIdSolicitante: this.cookieService.get('userIdNomina'),
              ausFechaIngreso: this.getLocalDate(new Date()),
              ausMotivo: this.motivoAusId,
              ausDesde: this.getLocalDate(this.getFinalDate(this.selectedStartDate, this.selectedStartHour, this.selectedStartMinutes)),
              ausHasta: this.getLocalDate(this.getFinalDate(this.selectedEndDate, this.selectedEndHour, this.selectedEndMinutes)),
              ausObservacion: this.observacionAus,
              ausEstadoProceso: lvl
            };

            this.ausentismoService.postAusentismo(data).subscribe(
              (res: any) => {
                console.log("REGISTRO GUARDADO: ",res);
                if (res) {
                  if (this.requiredDocument && this.documentList.length > 0) {
                    // Si requiere documentación, primero guarda los archivos
                    this.saveFiles(res);
                  } else {
                    // Si no requiere documentos, muestra éxito y limpia el formulario
                    this.callMessage('Ausentismo registrado correctamente.', true);
                    this.clearForm();
                  }
                }
              },
              (error) => {
                console.log(error);
                this.callMessage('Error al registrar el ausentismo.', false);
              }
            );
          }

        }
      }
    );


  }

  saveFiles(ausId: number) {
    let filesProcessed = 0;
    let hasError = false;
  
    // Array de observables para descargar archivos
    const downloadObservables = this.documentList.map((doc) => {
      if (doc.ruta) {
        return this.ausentismoService.downloadAusFile(doc.ruta).pipe(
          map((blob) => {
            doc.file = new File([blob], doc.name, { type: doc.img });
            console.log("Archivo descargado y asignado:", doc);
            return doc;
          }),
          catchError((error) => {
            console.error("Error al descargar el archivo:", error);
            return of(doc); // Continuar con el proceso sin fallar todo
          })
        );
      }
      return of(doc); // Si no tiene ruta, simplemente devolver el documento tal cual
    });
  
    // Esperar todas las descargas antes de enviar los archivos
    forkJoin(downloadObservables).subscribe((docs) => {
      docs.forEach((doc) => {
        this.ausentismoService.postArchivoAus(ausId, doc.file, this.creationMode).subscribe(
          () => {
            filesProcessed++;
            if (filesProcessed === this.documentList.length && !hasError) {
              this.callMessage("Ausentismo registrado correctamente.", true);
              this.clearForm();
            }
          },
          (error) => {
            console.error("Error al registrar un archivo:", error);
            hasError = true;
            filesProcessed++;
            this.callMessage("Error al registrar un archivo.", false);
  
            if (filesProcessed === this.documentList.length && !hasError) {
              this.callMessage("Ausentismo registrado correctamente.", true);
              this.clearForm();
            }
          }
        );
      });
    });
  }
  

  /*openFile(doc: any) {
    console.log(doc);

    // Verificar si el archivo ya está cargado en la lista
    const existingFile = this.documentList.find((item: any) => item.name === doc.name);

    if (existingFile && existingFile.file) {
      // El archivo está en memoria, lo abrimos con un Blob
      const fileURL = URL.createObjectURL(existingFile.file);
      window.open(fileURL, '_blank');
    } else {
      // El archivo no está en memoria, solicitarlo al servidor
      this.ausentismoService.downloadAusFile(doc.ruta).subscribe(
        (blob) => {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },
        (error) => {
          console.error("Error al obtener el archivo:", error);
        }
      );
    }
  }*/

    openFile(doc: any) {
      console.log(doc);
    
      // Verificar si el archivo ya está cargado en la lista
      const existingFile = this.documentList.find((item: any) => item.name === doc.name);
    
      if (existingFile && existingFile.file) {
        // El archivo está en memoria, lo abrimos con un Blob
        const fileURL = URL.createObjectURL(existingFile.file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = doc.name; // Mantener el nombre original
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // El archivo no está en memoria, solicitarlo al servidor
        this.ausentismoService.downloadAusFile(doc.ruta).subscribe(
          (blob) => {
            const fileURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = doc.name; // Mantener el nombre original
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(fileURL); // Liberar la URL del blob
          },
          (error) => {
            console.error("Error al obtener el archivo:", error);
            if(error.status === 404){
              this.callMessage("El archivo se ha eliminado del servidor o no se encuentra disponible.", false);
            }else{
              this.callMessage("Error al obtener el archivo.", false);
            }
          }
        );
      }
    }
    

}
