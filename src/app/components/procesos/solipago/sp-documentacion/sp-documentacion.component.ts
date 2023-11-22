import { Component, Input, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { SharedService } from 'src/app/services/shared.service';



interface Path {
  docUrl: any;
  docNombre: string;
  docUrlComleta: string;
}
@Component({
  selector: 'app-sp-documentacion',
  templateUrl: './sp-documentacion.component.html',
  styleUrls: ['./sp-documentacion.component.css']
})
export class SPDocumentacionComponent implements OnInit {
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
    private sharedService: SharedService, private dialogService:DialogServiceService
    ) { 
      this.sharedService.spDocumentacion$.subscribe(() =>{
        this.deleteAllDocs();
      });
    }

  ngOnInit(): void {
    setTimeout(() => {
      this.GetfileView();
      
    }, 100);
  }
  callMensaje(mensaje: string, type: boolean){
    this.dialogService.openAlertDialog(mensaje, type);
  }
  getFiles(event: any): void {
    //console.log('Imprimir esto ', event);
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    //console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }
  //Enviar archivos al servidor y guardar a  la base
  sendfile(): void {
    const body = new FormData();
    this.prefijo = 'SP' + this.noSol + '-';
    body.append('archivos', this.filesAll);
    this.uploadfile.uploadFile(body, this.prefijo, this.tipoSol, this.noSol).subscribe({
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
          this.callMensaje(msjError, false);
        }
      },
      complete: () => {
        //console.log('Proceso completado');
      },
    });
  }
  //Capturar la url del servidor y lo convierte en un blob para visualizarlo
  getUrlFile(ruta: string,nombre:string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.uploadfile.viewFile(ruta).subscribe({
        next: (blob) => {

          if(nombre == 'pdf'){
            const file = new Blob([blob], { type: 'application/pdf' });
          const urlfile = URL.createObjectURL(file);
          //console.log('URL del documento: ', urlfile);
          resolve(urlfile);
          }else if(nombre == 'png'){
            const file = new Blob([blob], { type: 'image/png' });
          const urlfile = URL.createObjectURL(file);
          resolve(urlfile);
          }else if(nombre == 'jpg'){
            const file = new Blob([blob], { type: 'image/jpg' });
          const urlfile = URL.createObjectURL(file);
          resolve(urlfile);
          }else if(nombre == 'jpeg'){
            const file = new Blob([blob], { type: 'image/jpeg' });
          const urlfile = URL.createObjectURL(file);
          resolve(urlfile);
          } 
        },
        error: (error) => {
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
      this.uploadfile.getFile(this.tipoSol, this.noSol).pipe(
        concatMap(async (data) => {
          const promises = data.map(async (item) => {
            try {
              const ruta = this.getNombreArchivo(item.docUrl);
              const docUrl = await this.getUrlFile(ruta,this.getNombres(item.docNombre)); // Espera a que se resuelva getUrlFile
              const pat: Path = {
                docNombre: item.docNombre,
                docUrl: docUrl, // Usa la URL resuelta
                docUrlComleta: item.docUrl
              };
              this.paths.push(pat);
            } catch (error) {
              console.error('Error al obtener la URL del archivo: ', error);
            }
          });

          await Promise.all(promises); // Espera a que todas las promesas se resuelvan

          //console.log('Lista de documentos: ', this.paths);
        })
      ).subscribe({
        error: (err) => {
          console.error('Error al momento de obtener ', err);
        },
        complete: () => {
          //console.log('Proceso completado');
        },
      });
    } catch (error) {
      console.log('Error en el proceso de GetfileView', error);
    } finally {
      console.log("Finalizado");
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
        this.callMensaje(msjExito, true);
        this.GetfileView();
      },
      error: (error) => {
        console.error(error);
        // const msjError = 'Error no se puede Eliminar el archivo intente nuevamente';
        // this.callMensaje(msjError, false);
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
