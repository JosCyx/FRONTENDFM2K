import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { SharedService } from 'src/app/services/shared.service';

interface Path {
  docUrl: any;
  docNombre: string;
  docUrlComleta: string;
  docImage: string;
}
@Component({
  selector: 'app-oc-documentacion',
  templateUrl: './oc-documentacion.component.html',
  styleUrls: ['./oc-documentacion.component.css'],
})
export class OCDocumentacionComponent implements OnInit, OnDestroy {
  //* Variables de archivo
  filesAll!: File;
  //* Variables compartidas
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  @Input() estadoSol!: string;
  @Input() view!: string;
  //
  prefijo!: string;

  paths: Path[] = [];

  showExito: boolean = false;
  showError: boolean = false;
  msjExito: string = '';
  msjError: string = '';

  subscription: Subscription = new Subscription();

  constructor(private uploadfile: UploadFileService,
    private sharedService: SharedService,private dialogService:DialogServiceService
    ) {
      this.sharedService.ocDocumentacion$.subscribe(() =>{
        this.deleteAllDocs();
      });
  }

  ngOnInit(): void {
    this.GetfileView();
  }
  //Mensajes de alertas
  callMensaje(mensaje: string, type: boolean){
    this.dialogService.openAlertDialog(mensaje, type);
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

  //Obtener archivos
  getFiles(event: any): void {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB en bytes

    try {
      const file = event.target.files[0];

      if(!this.isFileTypeAllowed(file)){
        const msjError = 'Tipo de archivo no permitido. Por favor, seleccione un archivo válido.';
        this.callMensaje(msjError, false);
        event.target.value = '';  // Limpiar la selección
      } else if (file.size > maxSizeInBytes) {
        const msjError = 'El tamaño del archivo no puede exceder los 5 MB.';
        this.callMensaje(msjError, false);
        event.target.value = '';  // Limpiar la selección
      } else {
        const modifiedName = file.name.replace(/#/g, " No.");
        this.filesAll = new File([file], modifiedName, { type: file.type });
      }
  
    } catch (error) {
      const msjError = 'Error al cargar el archivo';
      this.callMensaje(msjError, false);
      event.target.value = '';
    }
  }
  
  isFileTypeAllowed(file: File): boolean {
    const allowedTypes = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".doc", ".xlsx"];
    const fileType = `.${file.name.split('.').pop()}`.toLowerCase();
  
    return allowedTypes.includes(fileType);
  }

  //Enviar archivos al servidor y guardar a  la base
  sendfile(): void {
    const body = new FormData();
    this.prefijo = 'OC' + this.noSol + '-';
    body.append('archivos', this.filesAll);
    this.uploadfile
      .uploadFile(body, this.prefijo, this.tipoSol, this.noSol)
      .subscribe({
        next: (data) => {
          //console.log('este es mi data', data);
          const msjExito = 'Archivo Subido Correctamente';
          this.callMensaje(msjExito, true);
          this.GetfileView();

          const inputFile = document.getElementById('inputFile') as HTMLInputElement;
          if (inputFile) {
            inputFile.value = '';
          }
          this.filesAll = new File([], '');
        },
        error: (error) => {
          if (error.status == 400) {
            console.error('este es mi error', error);
            const msjError = 'Error, no se ha seleccionado un archivo o la solicitud no tiene un numero asignado. Asegúrese de ingresar el NOMBRE DEL SOLICITANTE para asignar un número a esta nueva solicitud.';
            this.callMensaje(msjError, false);
          } else {
            console.error('este es mi error', error);
            const msjError = 'Ha ocurrido un error, por favor intente nuevamente';
            this.callMensaje(msjError, false);
          }
        },
        complete: () => {
          //console.log('Proceso completado');
        },
      });
  }
   //Capturar la url del servidor y lo convierte
   getUrlFile(ruta: string,nombre:string): Promise<{ url: string, icono: string }> {
    return new Promise<{ url: string, icono: string }>((resolve, reject) => {
      this.uploadfile.viewFile(ruta).subscribe({
        next:(blob) => {
          if(nombre == 'pdf'){
            const file = new Blob([blob], { type: 'application/pdf' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/272699_pdf_icon.png';
          //console.log('URL del documento: ', urlfile);
          resolve({url: urlfile, icono: img});
          } else if (nombre == 'PDF') {
            const file = new Blob([blob], { type: 'application/pdf' });
            const urlfile = URL.createObjectURL(file);
            const img = 'assets/img/272699_pdf_icon.png';
            //console.log('URL del documento: ', urlfile);
            resolve({ url: urlfile, icono: img });
          } else if(nombre == 'png'){
            const file = new Blob([blob], { type: 'image/png' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/image.png';
          resolve({url: urlfile, icono: img});
          }else if(nombre == 'jpg'){
            const file = new Blob([blob], { type: 'image/jpg' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/image.png';
          resolve({url: urlfile, icono: img});
          }else if(nombre == 'jpeg'){
            const file = new Blob([blob], { type: 'image/jpeg' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/image.png';
          resolve({url: urlfile, icono: img});
          } else if(nombre == 'xlsx'){
            const file = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/excel.png.png';
          resolve({url: urlfile, icono: img});
          } else if(nombre == 'docx'){
            const file = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/docx.png';
          resolve({url: urlfile, icono: img});
          } else if(nombre == 'doc'){
            const file = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const urlfile = URL.createObjectURL(file);
          const img = 'assets/img/doc.png';
          resolve({url: urlfile, icono: img});
          }
        },
        error:(error) => {
          reject(error); // Rechaza la Promesa si ocurre un error
        },
        complete:()=>{
          //console.log("Finalizacion del SUBSCRIBE");
        }
    });
    });
  }
  // Me envia esta url para visualizar Solicitud_Orden_Compra\Nombre del archivo 
  getNombreArchivo(rutaCompleta: string) {
    const partes = rutaCompleta.split('\\'); // Dividir la cadena en función de la barra invertida
    if (partes.length > 1) {
      return partes.slice(-2).join('\\'); // Tomar las últimas dos partes y unirlas con '\\'
    }
    return rutaCompleta; // Si no hay barras invertidas, devuelve la ruta original
  }
  getNombres(rutaCompleta: string) {
    const partes = rutaCompleta.split('.'); 
    if (partes.length > 1) {
      return partes.slice(-1).join(); 
    }
    return rutaCompleta; 
  }
  // Esto me visualiza en el angular de OC  
  GetfileView() {
    this.paths = [];
    try {
      this.uploadfile.getFile(this.tipoSol, this.noSol).subscribe({
        next: async (data) => {
          //console.log('este es mi data', data);
          for (let i = 0; i < data.length; i++) {
            try {
              const ruta = this.getNombreArchivo(data[i].docUrl);
              //console.log(ruta);
              const urlFileResult = await this.getUrlFile(ruta, this.getNombres(data[i].docNombre));

              const docUrl: string = urlFileResult.url;
              const img: string = urlFileResult.icono;

              const pat: Path = {
                docNombre: data[i].docNombre,
                docUrl: docUrl, // Usa la URL resuelta
                docUrlComleta: data[i].docUrl,
                docImage: img
              };
              this.paths.push(pat);
            } catch (error) {
              console.error('Error al obtener la URL del archivo: ', error);
            }
          }
          //console.log('Lista de documentos: ', this.paths);
        },
        error:(err)=> {
          console.error('Error al momento de obtener ', err);
        },
        complete: () => {
          //console.log('Proceso completado');
        },
      });
    } catch (error) {
      console.log('Error en el proceso de GetfileView', error);
    } finally {
      //console.log('FIN DEL  CATCH');
    }
  }

  //recorre toda la lista de documentos y los elimina
  deleteAllDocs(){
    this.paths.forEach((item) => {
      this.deleteFile(item.docUrlComleta);
    });
    this.paths = [];
  }

  //emilima de la base de datos y del servidor el archivo que coincida con la url ingesada como parametro
  deleteFile(ruta: string) { 
    this.uploadfile.deleteFile(ruta).subscribe({
      next: (data) => {
        const msjExito = 'Archivo Eliminado Correctamente';
        this.callMensaje(msjExito, true)
        this.GetfileView();
      },
      error: (error) => {
        console.error(error);
        // const msjError = 'Error no se puede Eliminar el archivo intente nuevamente';
        // this.callMensaje(msjError, false)
      },
      complete: () => {
        //console.log('Proceso completado');
      },
    });
  }
  DowmloadFile(url: any, fileName: any) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobURL;
        a.download = fileName;
  
        document.body.appendChild(a);
        a.click();
  
        window.URL.revokeObjectURL(blobURL);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error al descargar el archivo:', error);
      });
  }
   allDownload() {
    this.paths.forEach((item) => {
      this.DowmloadFile(item.docUrl, item.docNombre);
    });
   }
}
