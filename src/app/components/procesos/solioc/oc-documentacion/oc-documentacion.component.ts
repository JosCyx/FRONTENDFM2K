import { Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';

interface Path {
  docUrl: any;
  docNombre: string;
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
  //
  prefijo!: string;

  paths: Path[] = [];

  showExito: boolean = false;
  showError: boolean = false;
  msjExito: string = '';
  msjError: string = '';
  constructor(private uploadfile: UploadFileService) {}
  ngOnInit(): void {
    this.GetfileView();
  }
  //Obtener archivos
  getFiles(event: any): void {
    try {
      this.filesAll = event.target.files[0];
      console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
    } catch (error) {
      this.showError = true;
      this.msjError = 'Error al cargar el archivo';
      event.target.value = '';
      setTimeout(() => {
        this.showError = false;
        this.msjError = '';
      }, 2000);
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
  //Capturar la url del servidor y lo convierte 
  getUrlFile(ruta: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.uploadfile.viewFile(ruta).subscribe({
        next:(blob) => {
          const file = new Blob([blob], { type: 'application/pdf' });
          const urlfile = URL.createObjectURL(file);
          console.log('URL del documento: ', urlfile);
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
          console.log('este es mi data', data);
          for (let i = 0; i < data.length; i++) {
            try {
              const ruta = this.getNombreArchivo(data[i].docUrl);
              console.log(ruta);
              const docUrl = await this.getUrlFile(ruta); // Espera a que se resuelva getUrlFile
              const pat: Path = {
                docNombre: data[i].docNombre,
                docUrl: docUrl, // Usa la URL resuelta
              };
              this.paths.push(pat);
            } catch (error) {
              console.error('Error al obtener la URL del archivo: ', error);
            }
          }
          console.log('Lista de documentos: ', this.paths);
        },
        error:(err)=> {
          console.error('Error al momento de obtener ', err);
        },
        complete: () => {
          console.log('Proceso completado');
        },
      });
    } catch (error) {
      console.log('Error en el proceso de GetfileView', error);
    } finally {
      console.log('FIN DEL  CATCH');
    }
  }
}
