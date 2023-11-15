import { Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { SharedService } from 'src/app/services/shared.service';

interface Path {
  docUrl: any;
  docNombre: string;
  docUrlComleta: string;
}
@Component({
  selector: 'app-oc-documentacion',
  templateUrl: './oc-documentacion.component.html',
  styleUrls: ['./oc-documentacion.component.css'],
})
export class OCDocumentacionComponent implements OnInit {
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
  //Obtener archivos
  getFiles(event: any): void {
    try {
      this.filesAll = event.target.files[0];
      //console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
    } catch (error) {
      const msjError = 'Error al cargar el archivo';
      this.callMensaje(this.msjError, false)
      event.target.value = '';
      
      console.error('Error al momento de subir ', error);
    }
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
        },
        error: (error) => {
          if (error.status == 400) {
            console.error('este es mi error', error);
            const msjError = 'Error deberia seleccionar un archivo';
            this.callMensaje(msjError, false);
          } else {
            console.error('este es mi error', error);
            const msjError ='Error no se puede Subir el archivo intente nuevamente';
            this.callMensaje(msjError, false)
          }
        },
        complete: () => {
          //console.log('Proceso completado');
        },
      });
  }
  //Capturar la url del servidor y lo convierte 
  getUrlFile(ruta: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.uploadfile.viewFile(ruta).subscribe({
        next:(blob) => {
          const file = new Blob([blob], { type: 'application/pdf' });
          const urlfile = URL.createObjectURL(file);
          //console.log('URL del documento: ', urlfile);
          resolve(urlfile); // Resuelve la Promesa con el valor de urlfile
        },
        error:(error) => {
          reject(error); // Rechaza la Promesa si ocurre un error
        }
    });
    });
  }
  //   \\\192.168.1.75\Solicitudes\
  // Me envia esta url para visualizar Solicitud_Orden_Compra\Nombre del archivo 
  getNombreArchivo(rutaCompleta: string) {
    const partes = rutaCompleta.split('\\'); // Dividir la cadena en función de la barra invertida
    if (partes.length > 1) {
      return partes.slice(-2).join('\\'); // Tomar las últimas dos partes y unirlas con '\\'
    }
    return rutaCompleta; // Si no hay barras invertidas, devuelve la ruta original
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
              const docUrl = await this.getUrlFile(ruta); // Espera a que se resuelva getUrlFile
              const pat: Path = {
                docNombre: data[i].docNombre,
                docUrl: docUrl, // Usa la URL resuelta
                docUrlComleta: data[i].docUrl
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
