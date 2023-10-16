import { Component, Input, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
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
  //
  prefijo!: string;

  paths: Path[] = [];

  showExito: boolean = false;
  showError: boolean = false;
  msjExito: string = '';
  msjError: string = '';

  constructor(private uploadfile: UploadFileService, 
    private sharedService: SharedService) { 
      this.sharedService.spDocumentacion$.subscribe(() =>{
        this.deleteAllDocs();
      });
    }

  ngOnInit(): void {
    setTimeout(() => {
      this.GetfileView();
      
    }, 100);
  }
  getFiles(event: any): void {
    console.log('Imprimir esto ', event);
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }
  //Enviar archivos al servidor y guardar a  la base
  sendfile(): void {
    const body = new FormData();
    this.prefijo = 'SP' + this.noSol + '-';
    body.append('archivos', this.filesAll);
    this.uploadfile.uploadFile(body, this.prefijo, this.tipoSol, this.noSol).subscribe({
      next: (data) => {
        console.log('este es mi data', data);
        this.showExito = true;
        this.msjExito = 'Archivo Subido Correctamente';
        setTimeout(() => {
          this.showExito = false;
          this.msjExito = '';
        }, 2000);
        this.GetfileView();
      },
      error: (error) => {
        if (error.status == 400) {
          console.error('este es mi error', error);
          this.showError = true;
          this.msjError = 'Error deberia seleccionar un archivo';
          setTimeout(() => {
            this.showError = false;
            this.msjError = '';
          }, 2000);
        } else {
          console.error('este es mi error', error);
          this.showError = true;
          this.msjError =
            'Error no se puede Subir el archivo intente nuevamente';
          setTimeout(() => {
            this.showError = false;
            this.msjError = '';
          }, 2000);
        }
      },
      complete: () => {
        console.log('Proceso completado');
      },
    });
  }
  //Capturar la url del servidor y lo convierte en un blob para visualizarlo
  getUrlFile(ruta: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.uploadfile.viewFile(ruta).subscribe({
        next: (blob) => {
          const file = new Blob([blob], { type: 'application/pdf' });
          const urlfile = URL.createObjectURL(file);
          console.log('URL del documento: ', urlfile);
          resolve(urlfile); // Resuelve la Promesa con el valor de urlfile
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
  // Esto me visualiza en el angular de OC  
  GetfileView() {
    this.paths = [];
    try {
      this.uploadfile.getFile(this.tipoSol, this.noSol).pipe(
        concatMap(async (data) => {
          const promises = data.map(async (item) => {
            try {
              const ruta = this.getNombreArchivo(item.docUrl);
              const docUrl = await this.getUrlFile(ruta); // Espera a que se resuelva getUrlFile
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

          console.log('Lista de documentos: ', this.paths);
        })
      ).subscribe({
        error: (err) => {
          console.error('Error al momento de obtener ', err);
        },
        complete: () => {
          console.log('Proceso completado');
        },
      });
    } catch (error) {
      console.log('Error en el proceso de GetfileView', error);
    } finally {
      console.log("Finalizando el bloque try-catch-finally");
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
        this.showExito = true;
        this.msjExito = 'Archivo Eliminado Correctamente';
        setTimeout(() => {
          this.showExito = false;
          this.msjExito = '';
        }, 2000);
        this.GetfileView();
      },
      error: (error) => {
        console.error(error);
        this.showError = true;
        this.msjError = 'Error no se puede Eliminar el archivo intente nuevamente';
        setTimeout(() => {
          this.showError = false;
          this.msjError = '';
        }, 2000);
      },
      complete: () => {
        console.log('Proceso completado');
      },
    });

  }
}
